import { Response } from "express";
import Item from "../models/items.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

const createItem = async (req: any, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    for (const file of files || []) {
      const result = await uploadToCloudinary(file.buffer);
      imageUrls.push(result.secure_url);
    }

    const location =
      typeof req.body.location === "string"
        ? JSON.parse(req.body.location)
        : req.body.location;

    const item = await Item.create({
      ...req.body,
      //   userId: req.userId,
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
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

const getItemById = async (req: any, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

const updateItem = async (req: any, res: Response) => {
  try {
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
