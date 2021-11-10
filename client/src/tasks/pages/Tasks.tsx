import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadTasks } from "../store/task.actions";

import NavbarTasks from "../components/NavbarTasks";
import TaskCards from "../components/TaskCards";
import { logRoles } from "@testing-library/dom";

const TasksPage: FC = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: any) => state.taskModule);

  useEffect(() => {
    dispatch(loadTasks());
    console.log(tasks);
  }, []);

  return (
    <>
      <NavbarTasks />
      <TaskCards tasks={tasks} />
    </>
  );
};

export default TasksPage;
