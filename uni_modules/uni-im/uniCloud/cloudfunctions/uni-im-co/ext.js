const db = uniCloud.database()
const dbCmd = db.command
module.exports = {
	async getUnreadCount() {
	  let unreadCount = 0
	  let unreadCountObj = {}
	  let res = await db.collection('uni-im-conversation')
	    .where({
	      user_id: this.current_uid,
	      leave: dbCmd.neq(true),
	      mute: dbCmd.neq(true),
	      unread_count: dbCmd.neq(0),
				hidden: dbCmd.neq(true),
	    })
	    .orderBy('unread_count', 'desc')
			.field({
				id: true,
				unread_count: true,
			})
	    .limit(100) //最多只要100，超过99的显示99+
	    .get()
	  res.data.forEach(item => {
	    unreadCount += item.unread_count
	    unreadCountObj[item.id] = item.unread_count
	  })
	  return {
			errcode: 0,
			data: {
				unreadCount,
				unreadCountObj
			}
	  }
	}
}