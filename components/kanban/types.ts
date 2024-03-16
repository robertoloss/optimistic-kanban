export type IdType = string | number;

export type ColumnType = {
  id: IdType;
  title: string;
};

export type TaskType = {
  id: IdType;
  columnId: IdType;
  content: string;
};


