interface ITodo {
  _id: string
  title: string
  creatorId: string
  ctime: string
  mtime: string
  star: boolean
  content: string
  status: 0 | 1 // 0未完成，1完成
  deleted: boolean
  progress: number
  priority: 0 | 1 | 2 // 0优先级低，1优先级中，2优先级高
  items?: Array<ITodo>
}

interface IList {
  _id: string
  title: string
  type: 0 | 1 // 0为默认列表，1为自定义新建列表Î
  ctime: string
  mtime: string
  creatorId: string
  todos: Array<ITodo>
  color: '#2196F3' | '#00BCD4' | '#FFEB3B'
  deleted: boolean
}
