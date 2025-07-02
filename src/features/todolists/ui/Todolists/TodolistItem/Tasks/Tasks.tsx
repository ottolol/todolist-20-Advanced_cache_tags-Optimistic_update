import { TaskStatus } from "@/common/enums";
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi";
import type { DomainTodolist } from "@/features/todolists/lib/types";
import List from "@mui/material/List";
import { TaskItem } from "./TaskItem/TaskItem";
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton";
import { useState } from "react";
import { TasksPagination } from "./TasksPagination/TasksPagination";
import { PAGE_SIZE } from "@/common/constants";

type Props = {
  todolist: DomainTodolist;
};

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist;

  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetTasksQuery({
    todolistId: id,
    params: { page },
  });

  let filteredTasks = data?.items;
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter(
      (task) => task.status === TaskStatus.New
    );
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter(
      (task) => task.status === TaskStatus.Completed
    );
  }

  if (isLoading) {
    return <TasksSkeleton />;
  }

  const totalCount = data?.totalCount || 0;
  const shouldShowPagination = totalCount > PAGE_SIZE;

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {filteredTasks?.map((task) => (
              <TaskItem key={task.id} task={task} todolist={todolist} />
            ))}
          </List>
          {shouldShowPagination && (
            <TasksPagination
              totalCount={totalCount}
              page={page}
              setPage={setPage}
            />
          )}
        </>
      )}
    </>
  );
};
