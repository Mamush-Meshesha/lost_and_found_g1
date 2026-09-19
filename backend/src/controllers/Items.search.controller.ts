import { Request, Response } from "express";
import Item from "../models/items.js";
import { runSearchAiMatch } from "./Items.search.ai.controller.js";

type ItemStatus = "active" | "recovered" | "closed";

export async function searchItems(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { q, categoryId, status, location, sort, ai } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof q === "string" && q.trim()) {
      const pattern = q.trim();
      filter.$or = [
        { title: { $regex: pattern, $options: "i" } },
        { description: { $regex: pattern, $options: "i" } },
      ];
    }

    if (typeof categoryId === "string" && categoryId.trim()) {
      filter.categoryId = categoryId.trim();
    }

    if (typeof status === "string" && status.trim()) {
      filter.status = status.trim() as ItemStatus;
    }

    if (typeof location === "string" && location.trim()) {
      filter["location.address"] = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    const sortDir = sort === "asc" ? 1 : -1;
    const items = await Item.find(filter).sort({
      lostDate: sortDir,
      createdAt: sortDir,
    });

    const response: {
      success: true;
      count: number;
      data: typeof items;
      aiMatch?: Awaited<ReturnType<typeof runSearchAiMatch>>;
    } = {
      success: true,
      count: items.length,
      data: items,
    };

    if (ai === "true" && typeof q === "string" && q.trim()) {
      response.aiMatch = await runSearchAiMatch(q, items);
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Search failed",
    });
  }
}
