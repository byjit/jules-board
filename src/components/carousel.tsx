"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Your utility for merging Tailwind classes

// Define the type for a single items item
export interface Item {
  id: string | number;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

// Props for the OfferCard component
interface ItemCardProps {
  item: Item;
}

// The individual card component with hover animation
const ItemCard = React.forwardRef<HTMLAnchorElement, ItemCardProps>(({ item }) => (
  <motion.div
    className="relative shrink-0 w-[260px] sm:w-[280px] md:w-[300px] h-[320px] sm:h-[340px] md:h-[350px] rounded-xl overflow-hidden group snap-start"
    style={{ perspective: "1000px" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    whileHover={{ y: -8 }}
  >
    {/* Background Image */}
    <div className="absolute inset-0 w-full h-2/4">
      <img
        alt={item.imageAlt}
        className="absolute inset-0 w-full h-2/4 object-cover transition-transform duration-500 group-hover:scale-110"
        height={"50%"}
        src={item.imageSrc}
        width={"100%"}
      />
    </div>
    {/* Card Content */}
    <div className="absolute bottom-0 left-0 right-0 h-2/4 bg-card p-4 sm:p-5 flex flex-col justify-between">
      <div className="space-y-1.5 sm:space-y-2">
        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-card-foreground leading-tight">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{item.description}</p>
      </div>

      {item.link && (
        <Button asChild className="w-fit px-3 sm:px-4 text-xs sm:text-sm" size={"sm"}>
          <a href={item.link} rel="noopener noreferrer" target="_blank">
            {item.linkText || "Learn More"}
          </a>
        </Button>
      )}
    </div>
  </motion.div>
));
ItemCard.displayName = "OfferCard";

export interface ItemCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Item[];
}

// The main carousel component with scroll functionality
const ItemCarousel = React.forwardRef<HTMLDivElement, ItemCarouselProps>(
  ({ items, className, ...props }, ref) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const { current } = scrollContainerRef;
        const scrollAmount = current.clientWidth * 0.8; // Scroll by 80% of the container width
        current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className={cn("relative w-full group", className)} ref={ref} {...props}>
        {/* Left Scroll Button - Hidden on mobile */}
        <button
          aria-label="Scroll Left"
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-0 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80 disabled:opacity-0"
          onClick={() => scroll("left")}
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Container */}
        <div
          className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x"
          ref={scrollContainerRef}
        >
          {items.map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
        </div>

        {/* Right Scroll Button - Hidden on mobile */}
        <button
          aria-label="Scroll Right"
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-0 z-10 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-border items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background/80 disabled:opacity-0"
          onClick={() => scroll("right")}
          type="button"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  }
);
ItemCarousel.displayName = "ItemCarousel";

export { ItemCarousel, ItemCard };
