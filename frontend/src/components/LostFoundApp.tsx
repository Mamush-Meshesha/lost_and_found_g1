import React, { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { IAiMatchResult, ICategory, IItem, IProof, IUser } from "../types";
import { CalendarIcon, MapPinIcon, SearchIcon, SparklesIcon } from "./common/Icons";

type View = "home" | "match" | "detail" | "create" | "myposts";

function categoryLabel(item: IItem, categories: ICategory[]) {
  if (item.categoryId && typeof item.categoryId === "object") {
    return item.categoryId.name;
  }
  return categories.find((c) => c._id === String(item.categoryId))?.name || "Uncategorized";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function sameId(a?: string, b?: string) {
  return Boolean(a) && String(a) === String(b);
}

export const LostFoundApp: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(api.getStoredUser());
  const [view, setView] = useState<View>("home");
  const [items, setItems] = useState<IItem[]>([]);
  const [myItems, setMyItems] = useState<IItem[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [aiMatch, setAiMatch] = useState<IAiMatchResult | null>(null);

  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [proofAnswer, setProofAnswer] = useState("");
  const [proofs, setProofs] = useState<IProof[]>([]);
  const [proofMsg, setProofMsg] = useState<string | null>(null);
  const [proofError, setProofError] = useState(false);

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUserName, setAuthUserName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formQuestion, setFormQuestion] = useState("");
  const [formPrivate, setFormPrivate] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [formBusy, setFormBusy] = useState(false);

  const loadFeed = useCallback(
    async (opts?: {
      ai?: boolean;
      q?: string;
      categoryId?: string;
      location?: string;
    }) => {
      if (!localStorage.getItem("token")) return;
      const q = opts?.q ?? searchQuery;
      const categoryId = opts?.categoryId ?? selectedCategoryId;
      const location = opts?.location ?? locationFilter;
      setLoading(true);
      setError(null);
      try {
        const res = await api.searchItems({
          q: q.trim() || undefined,
          categoryId: categoryId || undefined,
          location: location.trim() || undefined,
          sort: "desc",
          ai: opts?.ai,
        });
        setItems(res.data || []);
        setAiMatch(opts?.ai ? res.aiMatch || null : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load items");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, selectedCategoryId, locationFilter]
  );

  const loadMine = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await api.getItems();
      const me = api.getStoredUser();
      setMyItems(all.filter((item) => sameId(String(item.userId), me?._id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    api.getCategories().then((cats) => {
      setCategories(cats);
      setFormCategoryId((current) => current || cats[0]?._id || "");
    }).catch(() => setError("Could not load categories"));
    loadFeed();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    try {
      if (authMode === "register") {
        await api.register(authUserName.trim(), authEmail.trim(), authPassword);
      }
      const loginRes = await api.login(authEmail.trim(), authPassword);
      setUser(loginRes.user);
      setView("home");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setItems([]);
    setMyItems([]);
    setSelectedItem(null);
    setView("home");
  };

  const openDetail = async (item: IItem) => {
    setProofMsg(null);
    setProofError(false);
    setProofAnswer("");
    setImageIndex(0);
    setSelectedItem(item);
    setView("detail");
    try {
      const [full, list] = await Promise.all([
        api.getItemById(item._id),
        api.getItemProofs(item._id),
      ]);
      setSelectedItem(full);
      setProofs(list);
    } catch (err) {
      setProofs([]);
      setProofError(true);
      setProofMsg(err instanceof Error ? err.message : "Could not load item");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formCategoryId) {
      setFormError("Pick a category first");
      return;
    }
    setFormBusy(true);
    try {
      const form = new FormData(e.currentTarget as HTMLFormElement);
      form.set("title", formTitle.trim());
      form.set("description", formDescription.trim());
      form.set("categoryId", formCategoryId);
      form.set("lostDate", formDate);
      form.set("location", JSON.stringify({ address: formLocation.trim() }));
      form.set("question", formQuestion.trim());
      if (formPrivate.trim()) form.set("privateDetails", formPrivate.trim());
      await api.createItem(form);
      setFormTitle("");
      setFormDescription("");
      setFormLocation("");
      setFormQuestion("");
      setFormPrivate("");
      setFormKey((n) => n + 1);
      setSearchQuery("");
      setLocationFilter("");
      setSelectedCategoryId("");
      setView("home");
      await loadFeed({ q: "", categoryId: "", location: "" });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setFormBusy(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setProofMsg(null);
    setProofError(false);
    try {
      await api.submitProof(selectedItem._id, proofAnswer.trim());
      setProofAnswer("");
      setProofMsg("Answer submitted. Waiting for the holder to review.");
      setProofs(await api.getItemProofs(selectedItem._id));
    } catch (err) {
      setProofError(true);
      setProofMsg(err instanceof Error ? err.message : "Failed to submit proof");
    }
  };

  const handleReview = async (proof: IProof, status: "accepted" | "rejected") => {
    if (!selectedItem) return;
    setProofError(false);
    setProofMsg(null);
    try {
      await api.reviewProof(selectedItem._id, proof._id, status);
      const [full, list] = await Promise.all([
        api.getItemById(selectedItem._id),
        api.getItemProofs(selectedItem._id),
      ]);
      setSelectedItem(full);
      setProofs(list);
      setProofMsg(status === "accepted" ? "Proof accepted." : "Proof rejected.");
    } catch (err) {
      setProofError(true);
      setProofMsg(err instanceof Error ? err.message : "Review failed");
    }
  };

  const go = (next: View) => {
    setView(next);
    setError(null);
    if (next === "home") loadFeed({ ai: false });
    if (next === "match") loadFeed({ ai: true });
    if (next === "myposts") loadMine();
  };

  if (!user) {
    return (
      <div className="lf lf-auth">
        <form className="lf-panel" onSubmit={handleAuth}>
          <h2>Lost Item Store</h2>
          <p className="lf-note">
            {authMode === "login"
              ? "Log in to browse, post, and claim items."
              : "Create an account. You can post found items or answer a proof question."}
          </p>
          {authMode === "register" && (
            <label>
              <span className="lf-label">Username</span>
              <input
                placeholder="Username"
                value={authUserName}
                onChange={(e) => setAuthUserName(e.target.value)}
                required
              />
            </label>
          )}
          <label>
            <span className="lf-label">Email</span>
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span className="lf-label">Password</span>
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
            />
          </label>
          {authError && <div className="lf-error">{authError}</div>}
          <button className="lf-btn" type="submit" disabled={authBusy}>
            {authBusy ? "Please wait..." : authMode === "login" ? "Log in" : "Register"}
          </button>
          <button
            className="lf-btn ghost"
            type="button"
            onClick={() => {
              setAuthMode((m) => (m === "login" ? "register" : "login"));
              setAuthError(null);
            }}
          >
            {authMode === "login" ? "Need an account? Register" : "Have an account? Log in"}
          </button>
        </form>
      </div>
    );
  }

  const isHolder = selectedItem ? sameId(String(selectedItem.userId), user._id) : false;
  const blockingProof = proofs.find(
    (p) => sameId(String(p.askerId), user._id) && (p.status === "pending" || p.status === "accepted")
  );

  return (
    <div className="lf">
      <header className="lf-header">
        <div className="container-custom lf-bar">
          <nav className="lf-nav">
            {(
              [
                ["home", "Home"],
                ["create", "Create Post"],
                ["myposts", "View my Posts"],
                ["match", "Match AI"],
              ] as [View, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={view === key ? "active" : undefined}
                onClick={() => go(key)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="lf-user">
            <span>{user.userName}</span>
            <button className="lf-btn ghost" type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container-custom lf-main">
        {error && <div className="lf-error" style={{ marginBottom: "1rem" }}>{error}</div>}

        {(view === "home" || view === "match") && (
          <>
            <section className="lf-panel">
              <div className="lf-search">
                <div className="lf-search-box">
                  <SearchIcon size={18} />
                  <input
                    placeholder="Search lost items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") loadFeed({ ai: view === "match" });
                    }}
                  />
                </div>
                <input
                  style={{ flex: "0 1 180px" }}
                  placeholder="Location"
                  aria-label="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                <button className="lf-btn" type="button" onClick={() => loadFeed({ ai: view === "match" })}>
                  Search
                </button>
                <button className="lf-btn ghost" type="button" onClick={() => { setView("match"); loadFeed({ ai: true }); }}>
                  <SparklesIcon size={16} /> Match AI
                </button>
              </div>
              <div className="lf-chips">
                <button
                  type="button"
                  className={`lf-chip${!selectedCategoryId ? " active" : ""}`}
                  onClick={() => {
                    setSelectedCategoryId("");
                    loadFeed({ categoryId: "", ai: view === "match" });
                  }}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    className={`lf-chip${selectedCategoryId === c._id ? " active" : ""}`}
                    onClick={() => {
                      setSelectedCategoryId(c._id);
                      loadFeed({ categoryId: c._id, ai: view === "match" });
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              {view === "match" && (
                <div className="lf-ai">
                  <strong>Match AI</strong>
                  <div className="lf-note">
                    {!searchQuery.trim()
                      ? "Type a search, then run Match AI."
                      : aiMatch?.error
                        ? aiMatch.error
                        : aiMatch?.matchFound
                          ? `Found ${aiMatch.matches.length} likely match${aiMatch.matches.length === 1 ? "" : "es"}.`
                          : loading
                            ? "Scoring matches..."
                            : "No strong AI matches yet."}
                  </div>
                  {aiMatch?.matches?.map((m) => (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.85rem" }}>
                      <span>{m.item?.title || m.id}</span>
                      <span>{Math.round(m.score * 100)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {loading ? (
              <p className="lf-note" style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
            ) : items.length === 0 ? (
              <div className="lf-panel" style={{ textAlign: "center", marginTop: "1rem" }}>
                <p className="lf-note">No items match this search.</p>
                <button className="lf-btn" type="button" style={{ marginTop: "0.8rem" }} onClick={() => setView("create")}>
                  Create Post
                </button>
              </div>
            ) : (
              <div className="lf-grid">
                {items.map((item) => (
                  <button key={item._id} type="button" className="lf-card" onClick={() => openDetail(item)}>
                    <div className="lf-thumb">
                      {item.images?.[0] ? <img src={item.images[0]} alt="" /> : "Img"}
                    </div>
                    <div className="lf-card-body">
                      <div className="lf-kicker">
                        {categoryLabel(item, categories)}{" "}
                        <span className={`lf-badge${item.status === "recovered" ? " recovered" : ""}`}>{item.status}</span>
                      </div>
                      <div className="lf-title">{item.title}</div>
                      <div className="lf-desc">{item.description}</div>
                      <div className="lf-meta">
                        <span><MapPinIcon size={12} /> {item.location?.address || "—"}</span>
                        <span><CalendarIcon size={12} /> {formatDate(item.lostDate)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {view === "create" && (
          <form key={formKey} className="lf-panel lf-form" onSubmit={handleCreate}>
            <h2>Create Post</h2>
            <p className="lf-note">You are the holder. The proof question is what the owner must answer.</p>
            <label>
              <span className="lf-label">Title</span>
              <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
            </label>
            <label>
              <span className="lf-label">Description</span>
              <textarea style={{ minHeight: 90 }} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} required />
            </label>
            <label>
              <span className="lf-label">Category</span>
              <select value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="lf-label">Location</span>
              <input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} required />
            </label>
            <label>
              <span className="lf-label">Date</span>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />
            </label>
            <label>
              <span className="lf-label">Proof question</span>
              <input
                placeholder="What sticker is on the case?"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                required
              />
            </label>
            <label>
              <span className="lf-label">Private details</span>
              <textarea
                style={{ minHeight: 70 }}
                placeholder="Shown only after you accept a proof"
                value={formPrivate}
                onChange={(e) => setFormPrivate(e.target.value)}
              />
            </label>
            <label>
              <span className="lf-label">Images</span>
              <input name="images" type="file" accept="image/*" multiple />
            </label>
            {formError && <div className="lf-error">{formError}</div>}
            <div className="lf-actions">
              <button className="lf-btn ghost" type="button" onClick={() => setView("home")}>Cancel</button>
              <button className="lf-btn" type="submit" disabled={formBusy}>
                {formBusy ? "Publishing..." : "Publish"}
              </button>
            </div>
          </form>
        )}

        {view === "myposts" && (
          <section>
            <h2 style={{ marginBottom: "1rem" }}>My Posts</h2>
            {loading ? (
              <p className="lf-note">Loading...</p>
            ) : myItems.length === 0 ? (
              <p className="lf-note">You have not posted any items yet.</p>
            ) : (
              <div className="lf-list">
                {myItems.map((item) => (
                  <button key={item._id} type="button" className="lf-card" style={{ padding: "0.95rem 1rem" }} onClick={() => openDetail(item)}>
                    <div className="lf-title">{item.title}</div>
                    <div className="lf-note">
                      <span className={`lf-badge${item.status === "recovered" ? " recovered" : ""}`}>{item.status}</span>
                      {" "}{item.location?.address} · {item.question}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {view === "detail" && selectedItem && (
          <article className="lf-panel" style={{ maxWidth: 760, margin: "0 auto" }}>
            <button className="lf-btn ghost" type="button" onClick={() => go("home")}>Back</button>
            <div className="lf-gallery" style={{ marginTop: "1rem" }}>
              {selectedItem.images?.length ? (
                <img src={selectedItem.images[imageIndex] || selectedItem.images[0]} alt={selectedItem.title} />
              ) : (
                <span className="lf-note">Img</span>
              )}
              {(selectedItem.images?.length || 0) > 1 && (
                <>
                  <button
                    className="prev"
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setImageIndex((i) => (i - 1 + selectedItem.images.length) % selectedItem.images.length)
                    }
                  >
                    ‹
                  </button>
                  <button
                    className="next"
                    type="button"
                    aria-label="Next image"
                    onClick={() => setImageIndex((i) => (i + 1) % selectedItem.images.length)}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            <div className="lf-kicker">{categoryLabel(selectedItem, categories)}</div>
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.description}</p>
            <div className="lf-meta">
              <span><MapPinIcon size={14} /> {selectedItem.location?.address}</span>
              <span><CalendarIcon size={14} /> {formatDate(selectedItem.lostDate)}</span>
              <span className={`lf-badge${selectedItem.status === "recovered" ? " recovered" : ""}`}>{selectedItem.status}</span>
            </div>

            {selectedItem.privateDetails && (
              <div className="lf-private">
                <strong>Private details</strong>
                <div>{selectedItem.privateDetails}</div>
              </div>
            )}

            <div className="lf-question">
              <div className="lf-label">Proof question</div>
              <div>{selectedItem.question}</div>
            </div>

            {isHolder ? (
              <div className="lf-list">
                <h3>Proof answers</h3>
                {proofs.length === 0 ? (
                  <p className="lf-note">No answers yet.</p>
                ) : (
                  proofs.map((p) => (
                    <div key={p._id} className="lf-proof">
                      <div className="lf-note">Status: {p.status}</div>
                      <div>{p.answer}</div>
                      {p.status === "pending" && (
                        <div className="lf-actions" style={{ justifyContent: "flex-start" }}>
                          <button className="lf-btn" type="button" onClick={() => handleReview(p, "accepted")}>Accept</button>
                          <button className="lf-btn danger" type="button" onClick={() => handleReview(p, "rejected")}>Reject</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : blockingProof ? (
              <p className="lf-note">
                Your answer “{blockingProof.answer}” is {blockingProof.status}.
              </p>
            ) : (
              <form onSubmit={handleSubmitProof} className="lf-form" style={{ maxWidth: "none", margin: 0 }}>
                <label>
                  <span className="lf-label">Your answer</span>
                  <textarea
                    style={{ minHeight: 80 }}
                    placeholder="Your answer"
                    value={proofAnswer}
                    onChange={(e) => setProofAnswer(e.target.value)}
                    required
                  />
                </label>
                <button className="lf-btn" type="submit">Submit proof</button>
              </form>
            )}

            {proofMsg && <div className={proofError ? "lf-error" : "lf-ok"} style={{ marginTop: "0.8rem" }}>{proofMsg}</div>}
          </article>
        )}
      </main>
    </div>
  );
};

export default LostFoundApp;
