interface ITodo {
  _id: string
  title: string
  creatorId: string
  ctime: string
  mtime: string
  star: boolean
  content: string
  status: 0 | 1 | 2 // 0未完成，1完成，2已删除
  progress: number
  priority: 0 | 1 | 2 // 0优先级低，1优先级中，2优先级高
  items?: Array<ITodo>
}

interface IList {
  _id: string
  title: string
  ctime: string
  mtime: string
  creatorId: string
  todos: Array<ITodo>
  status: 0 | 1 // 0可操作， 1已删除
}
