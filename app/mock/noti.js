import promo from '../images/promo.png'
import notice1 from '../images/notice1.png'
import notice2 from '../images/notice2.png'

var notfication_view_data = {
	promos_avail : true,
	promo: {
		coins_earned: 100,
		new_level: 'B',
		image: promo,
		action_button: "Post Now",
		time:'21:34'

	},
	notifications: [
	{
		image: notice1,
		text: "Your promoted post recieved 20 comments",
		user_post_id: 5,
		action_button:'Check Now',
		time: "2017-3-10"
	},
	{
		image: notice2,
		text: "Your promoted post recieved 16 comments",
		user_post_id: 5,
		action_button:'Check Now',
		time: "2017-3-6"
	},
	]
}

export default notfication_view_data;