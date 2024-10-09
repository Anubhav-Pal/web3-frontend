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
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/types";
import StatusHelper from "@/components/common/status-helper";
const Home = () => {
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false as boolean);
  const [tasks, setTasks] = useState<Task[]>([]);
  const formSchema = z.object({
    title: z.string().min(2, {
      message: "title is required and must be at least 2 characters.",
    }),
    description: z.string().optional(),
    status: z.string(),
    dueDate: z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const handleAddTask = () => {
    setOpenAddTaskDialog(true);
  };

  const onSubmit = async (formData: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/tasks",
        formData
      );
      if (response.status === 201) {
        setOpenAddTaskDialog(false);
      }
    } catch (error) {
      console.log("Error creating the task: ", error);
    }
  };

  const handleEditTask = (id: string) => {
    console.log({ id });
  };
  const handleDeleteTask = (id: string) => {
    console.log({ id });
  };

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/tasks");
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="px-12 text-2xl font-bold py-4 shadow-sm">Taskify</div>
      <div className="px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xl capitalize font-semibold">
              All of your tasks
            </div>
            <StatusHelper />
          </div>
          <Button
            className="min-w-36 flex items-center text-sm uppercase"
            onClick={handleAddTask}
          >
            <CirclePlus size={18} className="mr-1" />
            Add a new task
          </Button>
        </div>
        {loading ? (
          <div className="w-full flex justify-center my-10">
            <LoaderCircle className="animate-spin" />
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {tasks.map((task, index) => {
              return (
                <TaskCard
                  key={index}
                  {...task}
                  onDelete={handleEditTask}
                  onEdit={handleDeleteTask}
                />
              );
            })}
          </div>
        )}
      </div>
      <DialogBox
        open={openAddTaskDialog}
        onClose={setOpenAddTaskDialog}
        title="Add a new task"
        description="Please provide a title and description for the new task. Once added, you can track the task's progress and set its status."
        className=""
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
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
                          {field.value ? field.value : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogBox>
    </div>
  );
};

export default Home;
