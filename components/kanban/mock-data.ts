import { ColumnType, TaskType } from "./types"



export const defaultColumns : ColumnType[] = [
	{
		id: "col1",
		title: "First Column"
	},
	{
		id: "col2",
		title: "Second Column"
	},{
		id: "col3",
		title: "Third Column"
	}
]

export const defaultTasks: TaskType[] = [
  {
    id: "task1",
    columnId: "col1",
    content: "Finish kanban app",
  },
  {
    id: "task2",
    columnId: "col2",
    content:
      "update linkedIn profile",
  },
  {
    id: "task3",
    columnId: "col1",
    content: "bring out the trash",
  },
  {
    id: "task4",
    columnId: "col2",
    content: "write an email to Jimbo",
  },
]
