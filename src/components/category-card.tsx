"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, Typography } from "@material-tailwind/react";

interface CategoryCardProps {
  img: string;
  title: string;
  desc: string;
  icon: React.ElementType;
}

function CategoryCard({ img, title, desc, icon: Icon }: CategoryCardProps) {
  return (
    <Link href="/books" className="block">
      <Card className="relative grid min-h-[12rem] w-full cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
        <Image
          width={768}
          height={768}
          src={img}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 h-full w-full bg-black/70 transition-opacity duration-300 hover:bg-black/60" />

        <CardBody className="relative flex flex-col justify-between">
          <Icon className="h-8 w-8 text-white" />

          <div>
            <Typography variant="h5" className="mb-1" color="white">
              {title}
            </Typography>
            <Typography
              color="white"
              className="text-xs font-semibold opacity-70"
            >
              {desc}
            </Typography>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default CategoryCard;
