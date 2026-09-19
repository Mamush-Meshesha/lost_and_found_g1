import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { IItem, IMatchResult, ItemCategory, ItemType, IUser } from '../types';
import { SearchIcon, PlusIcon, FilterIcon, SparklesIcon, MapPinIcon, CalendarIcon, UserIcon, TrashIcon, EditIcon, CheckSquareIcon, ShieldCheckIcon, PhoneIcon, MailIcon } from './common/Icons';

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Keys',
  'Wallets & Cards',
  'Pets',
  'Clothing',
  'Documents',
  'Jewelry',
  'Other',
];

export const LostFoundApp: React.FC = () => {
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('newest');

  // User state
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [demoUsers, setDemoUsers] = useState<IUser[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<IItem | null>(null);
  const [selectedItemForMatch, setSelectedItemForMatch] = useState<IItem | null>(null);
  const [matches, setMatches] = useState<IMatchResult[]>([]);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(false);

  // Form State
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ItemCategory>('Electronics');
  const [formType, setFormType] = useState<ItemType>('LOST');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formContactEmail, setFormContactEmail] = useState<string>('');
  const [formContactPhone, setFormContactPhone] = useState<string>('');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'feed' | 'matching'>('feed');

  // Fetch data
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.getItems({
        q: searchQuery,
        category: selectedCategory,
        type: selectedType,
        sort: sortBy,
      });
      if (res.success) {
        setItems(res.items);
      }
    } catch (err: any) {
      setError('Failed to fetch items from server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.getDemoUsers();
      if (res.success && res.users.length > 0) {
        setDemoUsers(res.users);
        if (!currentUser) {
          setCurrentUser(res.users[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [searchQuery, selectedCategory, selectedType, sortBy]);

  const handleSelectUser = (user: IUser) => {
    setCurrentUser(user);
    localStorage.setItem('demo_user_id', user.id);
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Electronics');
    setFormType('LOST');
    setFormLocation('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormImageUrl('');
    setFormContactEmail(currentUser?.email || '');
    setFormContactPhone('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (item: IItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormCategory(item.category);
    setFormType(item.type);
    setFormLocation(item.location);
    setFormDate(item.date);
    setFormImageUrl(item.imageUrl || '');
    setFormContactEmail(item.contactEmail);
    setFormContactPhone(item.contactPhone || '');
    setIsCreateModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formLocation) return;

    try {
      if (editingItem) {
        const res = await api.updateItem(editingItem.id, {
          title: formTitle,
          description: formDescription,
          category: formCategory,
          type: formType,
          location: formLocation,
          date: formDate,
          imageUrl: formImageUrl || undefined,
          contactEmail: formContactEmail,
          contactPhone: formContactPhone,
        });
        if (res.success) {
          setIsCreateModalOpen(false);
          fetchItems();
        }
      } else {
        const res = await api.createItem({
          title: formTitle,
          description: formDescription,
          category: formCategory,
          type: formType,
          location: formLocation,
          date: formDate,
          imageUrl: formImageUrl || undefined,
          contactEmail: formContactEmail || currentUser?.email,
          contactPhone: formContactPhone,
        });
        if (res.success) {
          setIsCreateModalOpen(false);
          fetchItems();
        }
      }
    } catch (err) {
      alert('Failed to save item report.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lost & found report?')) {
      try {
        const res = await api.deleteItem(id);
        if (res.success) {
          fetchItems();
          if (selectedItemForMatch?.id === id) {
            setSelectedItemForMatch(null);
          }
        }
      } catch (err) {
        alert('Failed to delete report.');
      }
    }
  };

  const handleViewMatches = async (item: IItem) => {
    setSelectedItemForMatch(item);
    setLoadingMatches(true);
    setActiveTab('matching');
    try {
      const res = await api.getItemMatches(item.id);
      if (res.success) {
        setMatches(res.matches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const lostCount = items.filter((i) => i.type === 'LOST').length;
  const foundCount = items.filter((i) => i.type === 'FOUND').length;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* App Header / Topbar */}
      <header
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: '#fff',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              LF
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>
                Community Lost & Found
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                ● Backend API & Match Engine Active
              </div>
            </div>
          </div>

          {/* User & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* User Quick Switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-surface-card)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', fontWeight: 600 }}>As:</span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {demoUsers.map((user) => {
                  const isSelected = currentUser?.id === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--color-text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {user.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleOpenCreateModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <PlusIcon size={18} />
              Report Item
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container-custom" style={{ marginTop: '2rem' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('feed')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'feed' ? 'var(--color-primary-light)' : 'transparent',
                color: activeTab === 'feed' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                border: activeTab === 'feed' ? '1px solid var(--color-primary)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <FilterIcon size={18} />
              Browse Reports ({items.length})
            </button>

            <button
              onClick={() => {
                if (items.length > 0 && !selectedItemForMatch) {
                  handleViewMatches(items[0]);
                } else {
                  setActiveTab('matching');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: 700,
                backgroundColor: activeTab === 'matching' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: activeTab === 'matching' ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                border: activeTab === 'matching' ? '1px solid var(--color-secondary)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <SparklesIcon size={18} />
              Smart Matching Engine
            </button>
          </div>

          {/* Quick Stats Badges */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              {lostCount} Lost Items
            </div>

            <div
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#34d399',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              {foundCount} Found Items
            </div>
          </div>
        </div>

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div>
            {/* Search & Filter Bar */}
            <div
              className="card-base"
              style={{
                marginBottom: '1.5rem',
                padding: '1.25rem',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search box */}
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                  <SearchIcon
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-dim)',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem 0.65rem 2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Status Pills */}
                <div style={{ display: 'flex', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '0.2rem', border: '1px solid var(--color-border)' }}>
                  {['ALL', 'LOST', 'FOUND'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: selectedType === type ? 'var(--color-primary)' : 'transparent',
                        color: selectedType === type ? '#fff' : 'var(--color-text-muted)',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                >
                  <option value="newest">Sort by: Newest First</option>
                  <option value="oldest">Sort by: Oldest First</option>
                </select>
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 600, alignSelf: 'center', marginRight: '0.5rem' }}>
                  Category:
                </span>
                {['ALL', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      backgroundColor: selectedCategory === cat ? 'var(--color-secondary-light)' : 'transparent',
                      color: selectedCategory === cat ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                      border: selectedCategory === cat ? '1px solid var(--color-secondary)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading / Items Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                Loading lost & found reports...
              </div>
            ) : items.length === 0 ? (
              <div
                className="card-base"
                style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--color-surface-card)' }}
              >
                <ShieldCheckIcon size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Reports Match Your Search</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Try adjusting your search keywords, clearing filters, or submit a new report.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Create New Report
                </button>
              </div>
            ) : (
              <div className="grid-3">
                {items.map((item) => {
                  const isOwner = currentUser?.id === item.userId || currentUser?.id === 'user-1';
                  return (
                    <div
                      key={item.id}
                      className="card-base card-hover"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      <div>
                        {/* Image Preview */}
                        {item.imageUrl && (
                          <div
                            style={{
                              width: '100%',
                              height: '180px',
                              borderRadius: 'var(--radius-md)',
                              overflow: 'hidden',
                              marginBottom: '1rem',
                              backgroundColor: 'var(--color-bg)',
                            }}
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}

                        {/* Status & Category Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              letterSpacing: '0.05em',
                              backgroundColor: item.type === 'LOST' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                              color: item.type === 'LOST' ? '#ef4444' : '#10b981',
                              border: `1px solid ${item.type === 'LOST' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                            }}
                          >
                            {item.type}
                          </span>

                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--color-secondary)',
                              backgroundColor: 'var(--color-secondary-light)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            {item.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-text)', lineHeight: 1.3 }}>
                          {item.title}
                        </h4>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '1rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.description}
                        </p>

                        {/* Meta Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MapPinIcon size={14} style={{ color: 'var(--color-primary)' }} />
                            <span>{item.location}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CalendarIcon size={14} style={{ color: 'var(--color-secondary)' }} />
                            <span>Date: {item.date}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <UserIcon size={14} />
                            <span>Reported by <strong>{item.userName}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div
                        style={{
                          paddingTop: '1rem',
                          borderTop: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <button
                          onClick={() => handleViewMatches(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-secondary-light)',
                            color: 'var(--color-secondary)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            cursor: 'pointer',
                          }}
                        >
                          <SparklesIcon size={14} />
                          Find Matches
                        </button>

                        {isOwner && (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              title="Edit Report"
                              style={{
                                padding: '0.4rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-surface-card)',
                                color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                              }}
                            >
                              <EditIcon size={14} />
                            </button>

                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              title="Delete Report"
                              style={{
                                padding: '0.4rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                cursor: 'pointer',
                              }}
                            >
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MATCHING TAB */}
        {activeTab === 'matching' && (
          <div>
            <div className="card-base" style={{ marginBottom: '2rem', padding: '1.75rem', backgroundColor: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <SparklesIcon size={24} style={{ color: 'var(--color-secondary)' }} />
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text)' }}>
                  Algorithmic Item Matching Engine (Milestone 4)
                </h3>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Select any reported lost or found item below to analyze candidate listings across categories, title/description TF-IDF keyword overlap, geographical location proximity, and report date deltas.
              </p>

              {/* Item Selector Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  Target Item for Matching:
                </label>
                <select
                  value={selectedItemForMatch?.id || ''}
                  onChange={(e) => {
                    const found = items.find((i) => i.id === e.target.value);
                    if (found) handleViewMatches(found);
                  }}
                  style={{
                    flex: '1 1 300px',
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-secondary)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="">-- Select an item to run match engine --</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      [{i.type}] {i.title} - {i.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Item Details Card & Results */}
            {selectedItemForMatch && (
              <div>
                <div
                  className="card-base"
                  style={{
                    marginBottom: '2rem',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid var(--color-primary-glow)',
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    ANALYZING ITEM REPORT
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{selectedItemForMatch.title}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{selectedItemForMatch.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span
                        style={{
                          padding: '0.3rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          backgroundColor: selectedItemForMatch.type === 'LOST' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: selectedItemForMatch.type === 'LOST' ? '#ef4444' : '#10b981',
                        }}
                      >
                        {selectedItemForMatch.type}
                      </span>
                      <span
                        style={{
                          padding: '0.3rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-secondary-light)',
                          color: 'var(--color-secondary)',
                        }}
                      >
                        {selectedItemForMatch.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Match Results */}
                <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                  Potential Matches ({matches.length} Candidates Found)
                </h4>

                {loadingMatches ? (
                  <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Computing correlation matrix & running match algorithm...
                  </div>
                ) : matches.length === 0 ? (
                  <div className="card-base" style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--color-surface-card)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
                      No high-confidence matches found for this item yet. Check back when new reports are submitted!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {matches.map((m, idx) => (
                      <div
                        key={m.item.id}
                        className="card-base"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: m.score > 70 ? 'var(--color-success)' : 'var(--color-border)',
                          padding: '1.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {/* Score Indicator Circle */}
                            <div
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                backgroundColor: m.score > 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: m.score > 70 ? '#10b981' : '#f59e0b',
                                border: `2px solid ${m.score > 70 ? '#10b981' : '#f59e0b'}`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1rem',
                              }}
                            >
                              <span>{m.score}%</span>
                              <span style={{ fontSize: '0.55rem', textTransform: 'uppercase' }}>Match</span>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                                MATCH CANDIDATE #{idx + 1}
                              </div>
                              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-text)' }}>{m.item.title}</h4>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span
                              style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                backgroundColor: m.item.type === 'LOST' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                color: m.item.type === 'LOST' ? '#ef4444' : '#10b981',
                              }}
                            >
                              {m.item.type}
                            </span>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                          {m.item.description}
                        </p>

                        {/* Match Reasons Tags */}
                        <div style={{ backgroundColor: 'var(--color-bg)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                            Match Logic Reasons:
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {m.reasons.map((r, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                  color: 'var(--color-primary)',
                                }}
                              >
                                ✓ {r}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contact details */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MailIcon size={14} /> {m.item.contactEmail}
                            </span>
                            {m.item.contactPhone && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <PhoneIcon size={14} /> {m.item.contactPhone}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => alert(`Connect request sent to ${m.item.userName} (${m.item.contactEmail})`)}
                            style={{
                              padding: '0.45rem 1rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--color-primary)',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            Contact Reporter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      {isCreateModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="card-base"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: 'var(--color-surface)',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text)' }}>
                {editingItem ? 'Edit Report' : 'Report Lost / Found Item'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Type Toggle */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                  Report Type *
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      backgroundColor: formType === 'LOST' ? 'rgba(239, 68, 68, 0.2)' : 'var(--color-bg)',
                      color: formType === 'LOST' ? '#ef4444' : 'var(--color-text-muted)',
                      border: `1px solid ${formType === 'LOST' ? '#ef4444' : 'var(--color-border)'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="LOST"
                      checked={formType === 'LOST'}
                      onChange={() => setFormType('LOST')}
                      style={{ display: 'none' }}
                    />
                    I LOST AN ITEM
                  </label>

                  <label
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      backgroundColor: formType === 'FOUND' ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-bg)',
                      color: formType === 'FOUND' ? '#10b981' : 'var(--color-text-muted)',
                      border: `1px solid ${formType === 'FOUND' ? '#10b981' : 'var(--color-border)'}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="FOUND"
                      checked={formType === 'FOUND'}
                      onChange={() => setFormType('FOUND')}
                      style={{ display: 'none' }}
                    />
                    I FOUND AN ITEM
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silver MacBook Pro 14 inch"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              {/* Category & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ItemCategory)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Campus Library - 2nd Floor"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide distinct marks, color, stickers, or details..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              {/* Image URL & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formContactPhone}
                    onChange={(e) => setFormContactPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {editingItem ? 'Save Changes' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundApp;
