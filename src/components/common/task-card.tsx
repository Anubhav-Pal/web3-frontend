import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Task } from "@/lib/types";
import { Badge } from "../ui/badge";

type Props = {
  _id: string;
  key: number;
  title: string;
  description?: string;
  status: "completed" | "in-progress" | "pending";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  onDelete: (id: string) => void;
  onEdit: (taskData: Task) => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "in-progress":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
const getBadgeColor = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "bg-green-400";
    case "medium":
      return "bg-yellow-400";
    case "high":
      return "bg-red-400";
    default:
      return "gray";
  }
};
const TaskCard: React.FC<Props> = ({
  title,
  description,
  status,
  dueDate,
  _id,
  onEdit,
  onDelete,
  priority,
}) => {
  return (
    <div>
      <Card className="w-full md:w-[400px] min-h-[250px] rounded-sm border-[0.5px] shadow-none flex flex-col justify-between">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 w-full">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {/* <Popover open={isOpen} onOpenChange={setIsOpen}> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start "
                  onClick={() => {
                    const taskData = {
                      title,
                      description,
                      status,
                      dueDate,
                      priority,
                      _id,
                    };
                    onEdit(taskData);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    onDelete(_id);
                    // setIsOpen(false);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent className="w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between flex-col p-0">
          <div className="flex justify-between w-full px-6 pb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <Badge
                className={`font-semibold shadow-none ${getBadgeColor(
                  priority
                )}`}
              >
                Priority: {priority}
              </Badge>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Due:{" "}
              {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
            </div>
          </div>
          <div
            className={`${getStatusColor(
              status
            )} text-white shadow-none rounded-b-sm w-full h-1`}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaskCard;
