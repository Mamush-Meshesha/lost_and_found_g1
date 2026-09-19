import { Request, Response } from "express";
import mongoose from "mongoose";
import Item from "../models/items.js";
import Proof from "../models/proof.js";

interface AuthRequest extends Request {
  user?: { id?: string; email?: string };
}

const submitProof = async (req: AuthRequest, res: Response) => {
  try {
    const askerId = req.user?.id;
    if (!askerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const itemId = req.params.id;
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid item id" });
    }

    const answer = typeof req.body.answer === "string" ? req.body.answer.trim() : "";
    if (!answer) {
      return res.status(400).json({ success: false, message: "Answer is required" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (!item.userId) {
      return res.status(400).json({
        success: false,
        message: "This item has no holder",
      });
    }

    if (String(item.userId) === String(askerId)) {
      return res.status(403).json({
        success: false,
        message: "The holder cannot submit proof for their own item",
      });
    }

    if (!item.question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "This item has no proof question",
      });
    }

    if (item.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This item is no longer open for proof",
      });
    }

    const existing = await Proof.findOne({
      itemId: item._id,
      askerId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          existing.status === "accepted"
            ? "Your proof was already accepted"
            : "You already have a pending proof for this item",
      });
    }

    const proof = await Proof.create({
      itemId: item._id,
      holderId: item.userId,
      askerId,
      question: item.question,
      answer,
      status: "pending",
    });

    return res.status(201).json({ success: true, data: proof });
  } catch (error) {
    console.error("SUBMIT PROOF ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting proof",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getItemProofs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const itemId = req.params.id;
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid item id" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const isHolder = Boolean(item.userId) && String(item.userId) === String(userId);
    const filter = isHolder
      ? { itemId: item._id }
      : { itemId: item._id, askerId: userId };

    const proofs = await Proof.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: proofs.length,
      data: proofs,
    });
  } catch (error) {
    console.error("GET PROOFS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching proofs",
      error: error instanceof Error ? error.message : error,
    });
  }
};

const reviewProof = async (req: AuthRequest, res: Response) => {
  try {
    const holderId = req.user?.id;
    if (!holderId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id: itemId, proofId } = req.params;
    if (!mongoose.isValidObjectId(itemId) || !mongoose.isValidObjectId(proofId)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const status = req.body.status;
    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected",
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (!item.userId || String(item.userId) !== String(holderId)) {
      return res.status(403).json({
        success: false,
        message: "Only the holder can accept or reject a proof",
      });
    }

    const proof = await Proof.findOne({ _id: proofId, itemId: item._id });
    if (!proof) {
      return res.status(404).json({ success: false, message: "Proof not found" });
    }

    if (proof.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This proof has already been reviewed",
      });
    }

    proof.status = status;
    await proof.save();

    if (status === "accepted") {
      await Proof.updateMany(
        {
          itemId: item._id,
          _id: { $ne: proof._id },
          status: "pending",
        },
        { $set: { status: "rejected" } }
      );
      item.status = "recovered";
      await item.save();
    }

    return res.status(200).json({
      success: true,
      data: proof,
      itemStatus: item.status,
    });
  } catch (error) {
    console.error("REVIEW PROOF ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error reviewing proof",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export { submitProof, getItemProofs, reviewProof };
