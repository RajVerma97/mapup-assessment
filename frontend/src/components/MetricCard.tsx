import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  color = "#000",
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
      className="bg-white rounded-xl  p-4 md:p-6 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-lg bg-opacity-10"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className=" text-md md:text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
