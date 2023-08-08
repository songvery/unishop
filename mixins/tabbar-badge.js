// 按需导入mapGetters辅助方法
import {mapGetters} from 'vuex';

export default {
	computed:{
		// 将m_cart模块中的total映射为当前页面的计算属性
		...mapGetters('m_cart',['total']),
	},
	watch:{
		// 监听total值的变化
		total(){
			// 重新为tabBar数字徽标赋值
			this.setBadge();
		}
	},
	methods:{
		setBadge(){
			// 调用uni.setTabBarBadge方法，为购物车设置右上角的徽标
			uni.setTabBarBadge({
				index:2,//索引
				text:this.total+''//注意：text的值必须是字符串，不能为数字
			})
		}
	},
	onShow() {
		// 在页面刚加载的时候,设置数字徽标
		this.setBadge();
	}
}