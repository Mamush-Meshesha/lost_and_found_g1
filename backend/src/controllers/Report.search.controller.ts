import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import Item, { IItem } from "../models/items";
import { runSearchAiMatch } from "./report.search.ai.controller";

/**
 * GET /api/reports — Milestone 2 search / filter / sort
 * Query params: q, categoryId, status, location, sort (asc|desc), ai (true)
 */
export async function searchReports(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { q, categoryId, status, location, sort, ai } = req.query;
    const filter: FilterQuery<IItem> = {};

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
      filter.status = status.trim() as IItem["status"];
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
