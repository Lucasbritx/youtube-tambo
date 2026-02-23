/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import {
  getTrendingVideos,
  getVideoAnalytics,
  getVideoById,
} from "@/services/youtube-videos";
import { searchAndUpdateVideos } from "@/services/video-actions";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "searchVideos",
    description:
      "Search YouTube for videos based on ANY user query and UPDATE the main video list in the Discover tab. This tool uses AI to rate and filter videos for relevance. Use this whenever the user asks to find, show, search, or display videos about ANY topic. The query should be the user's exact search intent (e.g., 'how to pass Amazon SWE job interviews', 'React hooks tutorial', 'machine learning for beginners').",
    tool: searchAndUpdateVideos,
    inputSchema: z.object({
      query: z.string().describe("The search query - can be anything the user wants to find videos about. Be specific and use the user's exact intent."),
      limit: z.number().optional().default(8).describe("Number of videos to return (default: 8)"),
      sortBy: z.enum(["relevance", "date", "viewCount", "rating"]).optional().default("relevance").describe("How to sort results"),
      aiRating: z.boolean().optional().default(true).describe("Whether to use AI to rate and filter videos for relevance (default: true)"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      query: z.string(),
      videoCount: z.number(),
      aiRated: z.boolean(),
      topVideos: z.array(z.object({
        title: z.string(),
        channel: z.string(),
        views: z.string(),
        relevanceScore: z.string().optional(),
      })),
    }),
  },
  {
    name: "trendingVideos",
    description:
      "Get trending tech videos data for analysis purposes only (does NOT update the UI). Use 'searchVideos' instead if you want to show videos to the user.",
    tool: getTrendingVideos,
    inputSchema: z.object({
      category: z.string().optional().describe("Filter by video category"),
      limit: z.number().optional().describe("Limit the number of results"),
      sortBy: z.enum(["views", "recent", "rating"]).optional().describe("Sort videos by criteria"),
      useRealApi: z.boolean().optional().describe("Whether to use real YouTube API (default: true if API key is configured)"),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        rank: z.number(),
        thumbnail: z.string(),
        title: z.string(),
        channel: z.string(),
        views: z.string(),
        timeAgo: z.string(),
        rating: z.enum(["Excellent", "Good"]),
        category: z.string().optional(),
        description: z.string().optional(),
      }),
    ),
  },
  {
    name: "videoAnalytics",
    description:
      "Get analytics summary for YouTube videos including total views, video counts, ratings, and available categories",
    tool: getVideoAnalytics,
    inputSchema: z.object({}),
    outputSchema: z.object({
      totalVideos: z.number(),
      totalViews: z.string(),
      excellentRating: z.number(),
      averageViews: z.string(),
      categories: z.array(z.string()),
    }),
  },
  {
    name: "getVideo",
    description:
      "Get detailed information about a specific video by its ID",
    tool: getVideoById,
    inputSchema: z.object({
      id: z.string().describe("The video ID"),
    }),
    outputSchema: z.object({
      id: z.string(),
      rank: z.number(),
      thumbnail: z.string(),
      title: z.string(),
      channel: z.string(),
      views: z.string(),
      timeAgo: z.string(),
      rating: z.enum(["Excellent", "Good"]),
      category: z.string().optional(),
      description: z.string().optional(),
    }).nullable(),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // Add more components here
];

