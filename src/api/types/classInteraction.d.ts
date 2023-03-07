export interface IgetIssueListById {
	pid: number
	type: number | string
	current?: number
	size?: number
}

export interface IPushParams {
	pid: number
	sid: number
	passLine?: number
	jobNum: string
	startTime: number
	endTime: number
	type: number
	signCount?: number
}

export interface IQuestlogById {
	/** 备课id */
	pid: number
	/** 1选择 2填空 3简答 4判断 5多选 不传默认全部  */
	type?: 1 | 2 | 3 | 4 | 5
	/** 时间类型 1未开始 2进行中 3已结束 不传默认已结束 */
	timeType: 1 | 2 | 3
}
