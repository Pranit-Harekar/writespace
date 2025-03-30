
import React from "react";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: "technology", name: "Technology" },
  { id: "health", name: "Health" },
  { id: "education", name: "Education" },
  { id: "culture", name: "Culture" },
  { id: "politics", name: "Politics" },
  { id: "business", name: "Business" },
  { id: "science", name: "Science" },
  { id: "entertainment", name: "Entertainment" },
  { id: "sports", name: "Sports" },
  { id: "travel", name: "Travel" },
  { id: "food", name: "Food" },
];

export const CategoryList = () => {
  return (
    <div className="my-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 p-1">
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/">All</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="rounded-full"
              asChild
            >
              <Link to={`/category/${category.id}`}>{category.name}</Link>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
