import { Response } from "express";
import Item from "../models/items.js";
import Proof from "../models/proof.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

const createItem = async (req: any, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

import { Request } from "express";

interface AuthRequest extends Request {
  user?: any;
}

const createItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const question =
      typeof req.body.question === "string" ? req.body.question.trim() : "";
    if (!question) {
      return res.status(400).json({
        success: false,
        message: "A proof question is required",
      });
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    // Upload images to Cloudinary
    for (const file of files || []) {
      const result = await uploadToCloudinary(file.buffer);
      imageUrls.push(result.secure_url);
    }

    // Parse location when using multipart/form-data
    const location =
      typeof req.body.location === "string"
        ? JSON.parse(req.body.location)
        : req.body.location;

    const item = await Item.create({
      ...req.body,
      question,

      // Always get userId from the authenticated user
      userId: req.user.id,

      location,
      images: imageUrls,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("CREATE ITEM ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error creating item",
      error: error instanceof Error ? error.message : error,
    });
  }
};


const getItems = async (_req: any, res: Response) => {
  try {
    const items = await Item.find().select("-privateDetails");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

const getItemById = async (req: AuthRequest, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const payload = item.toObject();
    const viewerId = req.user?.id;
    const isHolder =
      Boolean(item.userId) && String(item.userId) === String(viewerId);

    let canSeePrivate = isHolder;
    if (!canSeePrivate && viewerId) {
      const accepted = await Proof.exists({
        itemId: item._id,
        askerId: viewerId,
        status: "accepted",
      });
      canSeePrivate = Boolean(accepted);
    }

    if (!canSeePrivate) {
      payload.privateDetails = null;
    }

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching item", error });
  }
};

const updateItem = async (req: any, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    for (const file of files || []) {
      const result = await uploadToCloudinary(file.buffer);
      imageUrls.push(result.secure_url);
    }

    if (imageUrls.length > 0) {
      req.body.images = imageUrls;
    }

    const location =
      typeof req.body.location === "string"
        ? JSON.parse(req.body.location)
        : req.body.location;

    if (location) {
      req.body.location = location;
    }
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

const deleteItem = async (req: any, res: Response) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

export { createItem, getItems, getItemById, updateItem, deleteItem };
