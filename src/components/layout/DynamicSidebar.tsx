"use client";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MainSidebar } from "./MainSidebar";
import { ClientSidebar } from "./ClientSidebar";
// import { AgentSidebar } from "./AgentSidebar";

export function DynamicSidebar() {
  const pathname = usePathname();

  const isClientPage = pathname.startsWith("/client/");

  // Sidebar key changes only when switching between MainSidebar and ClientSidebar
  const sidebarKey = isClientPage ? "client-sidebar" : "main-sidebar";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sidebarKey} // Only updates when switching between Main and Client sidebars
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
         className="w-64 h-full bg-white border-r border-gray-200 flex-shrink-0 sticky top-0"
      >
        {isClientPage ? <ClientSidebar /> : <MainSidebar />}
      </motion.div>
    </AnimatePresence>
  );
}