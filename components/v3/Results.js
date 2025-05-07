"use client";

import { CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Results({ results }) {
  return (
    <motion.div
      initial={{ filter: "blur(8px)" }}
      animate={{ filter: "blur(0px)" }}
      transition={{ duration: 1 }}
      className="flex flex-col gap-4 card card-border text-center justify-center items-center"
    >
      <div className="card-body">
        <h1 className="text-2xl font-bold">{results.title}</h1>
        {results.verified ? (
          <>
            <CheckCircle2 className="mx-auto text-green-600 size-32 bg-green-100 rounded-full p-4" />
          </>
        ) : (
          <>
            <X className="mx-auto text-red-600 size-32 bg-red-100 rounded-full p-4" />
          </>
        )}
        <p>{results.description}</p>
      </div>
    </motion.div>
  );
}
