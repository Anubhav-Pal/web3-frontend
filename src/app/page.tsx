"use client";
import DialogBox from "@/components/common/dialog-box";
import TaskCard from "@/components/common/task-card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CirclePlus, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, serverUrl } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/types";
import StatusHelper from "@/components/common/status-helper";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/common/dark-mode-toggle";
const Home = () => {
  const { toast } = useToast();
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState<boolean>(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false as boolean);
  const [selectStatus, setSelectStatus] = useState<string>("all" as string);
  const [selectPriority, setSelectPriority] = useState<string>("all" as string);
  const [loading, setLoading] = useState<boolean>(true as boolean);
  const [tasks, setTasks] = useState<Task[]>([]);
  const formSchema = z.object({
    title: z.string().min(2, {
      message: "title is required and must be at least 2 characters.",
    }),
    description: z.string().optional(),
    status: z.string(),
    dueDate: z.date().optional(),
    priority: z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "low",
      dueDate: undefined,
    },
  });
  const handleAddTask = () => {
    setEditTaskData(null);
    setOpenAddTaskDialog(true);
  };

  const onSubmit = async (formData: {
    title: string;
    description?: string;
    status: string;
    dueDate?: Date;
    priority?: string;
  }) => {
    const dataToSubmit = {
      ...formData,
      dueDate: formData.dueDate ? formData.dueDate : null,
    };

    try {
      const response = await axios.post(`${serverUrl}/tasks`, dataToSubmit);
      if (response.status === 201) {
        setOpenAddTaskDialog(false);
        form.reset();
        toast({
          title: "Task added successfully.",
        });
        fetchAllTasks();
      }
    } catch (error) {
      console.log("Error creating the task: ", error);
    }
  };

  const onEdit = async (editedFormData: {
    title: string;
    description?: string;
    status: string;
    dueDate?: Date;
    priority?: string;
  }) => {
    const dataToEdit = {
      ...editedFormData,
      dueDate: editedFormData.dueDate ? editedFormData.dueDate : null,
    };

    try {
      const response = await axios.put(
        `${serverUrl}/tasks/${editTaskData?._id}`,
        dataToEdit
      );
      if (response.status === 200) {
        setOpenAddTaskDialog(false);
        form.reset();
        toast({ title: "Task updated successfully." });
        fetchAllTasks();
        setIsEditing(false);
        setSelectStatus("all");
      }
    } catch (error) {
      console.log("Error editing the task: ", error);
    }
  };

  const handleEditTask = (taskData: Task) => {
    console.log({ taskData });
    setIsEditing(true);
    setEditTaskData(taskData);
    setOpenAddTaskDialog(true);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      console.log({ id });
      const response = await axios.delete(`${serverUrl}/tasks/${id}`);
      console.log(response);
      if (response.status === 200 || response.status === 204) {
        fetchAllTasks();
        toast({
          title: "Task deleted successfully.",
        });
      }
      setSelectStatus("all");
    } catch (error) {
      console.log("Error deleting the task: ", error);
    }
  };

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/tasks`);
      if (response.status === 200) {
        setTasks(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);
  useEffect(() => {
    if (editTaskData) {
      form.reset({
        title: editTaskData.title || "",
        description: editTaskData.description || "",
        status: editTaskData.status || "pending",
        dueDate: editTaskData.dueDate,
        priority: editTaskData.priority,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "pending",
        dueDate: undefined,
        priority: "low",
      });
    }
  }, [editTaskData, form]);

  const handleDialogClose = () => {
    setOpenAddTaskDialog(false);
    setIsEditing(false);
  };
  useEffect(() => {
    const fetchFilteredTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/tasks`);
        if (response.status === 200) {
          let fetchedTasks = response.data;

          if (selectStatus !== "all") {
            fetchedTasks = fetchedTasks.filter(
              (task: Task) => task.status === selectStatus
            );
          }

          if (selectPriority !== "all") {
            fetchedTasks = fetchedTasks.filter(
              (task: Task) => task.priority === selectPriority
            );
          }

          setTasks(fetchedTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
      setLoading(false);
    };

    fetchFilteredTasks();
  }, [selectStatus, selectPriority]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="w-full px-12 py-4 shadow-sm flex items-center justify-between">
        <div className="text-2xl font-bold">Taskify</div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <div className="px-12 py-4">
        <div className="flex md:items-center justify-between lg:flex-row flex-col items-start gap-8">
          <div className="flex md:items-center gap-2 flex-col md:flex-row items-start w-full">
            <div className="text-xl capitalize font-semibold">
              All of your tasks
            </div>
            <StatusHelper />
          </div>
          <div className="flex items-center gap-2 md:flex-row flex-col w-full">
            <div className="flex items-center gap-2 lg:justify-end justify-between w-full">
              <div
                className="text-[14px] font-semibold text-blue-700  hover:underline cursor-pointer"
                onClick={() => {
                  setSelectPriority("all");
                  setSelectStatus("all");
                }}
              >
                Clear filters
              </div>
              <Select value={selectStatus} onValueChange={setSelectStatus}>
                <SelectTrigger className="md:w-[180px] w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectPriority} onValueChange={setSelectPriority}>
                <SelectTrigger className="md:w-[180px] w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="md:w-44 w-full flex items-center text-sm uppercase"
              onClick={handleAddTask}
            >
              <CirclePlus size={18} className="mr-1" />
              Add a new task
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="w-full flex justify-center my-10">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : (
          <div className="mt-4 flex flex-col md:flex-row md:flex-wrap gap-2">
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                return (
                  <TaskCard
                    key={index}
                    {...task}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                );
              })
            ) : (
              <h2>No tasks found</h2>
            )}
          </div>
        )}
      </div>
      <DialogBox
        open={openAddTaskDialog}
        onClose={handleDialogClose}
        title="Add a new task"
        description="Please provide a title and description for the new task. Once added, you can track the task's progress and set its status."
        className=""
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(isEditing ? onEdit : onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Make a project for..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pending" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Low" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            new Date(field.value).toLocaleDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
          </form>
        </Form>
      </DialogBox>
    </div>
  );
};

export default Home;
