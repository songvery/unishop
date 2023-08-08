// 1,导入vue和vuex
import Vue from 'vue';
import Vuex from 'vuex';

// 导入购物车的vuex模块
import moduleCart from './cart.js';

// 导入用户的vuex模块
import moduleUser from './user.js';

// 2,将vuex安装为vue的插件
Vue.use(Vuex);

// 3,创建Store的实例对象
const store = new Vuex.Store({
	// 挂载store模块
	modules:{
		// 挂载购物车的vuex模块,模块内的成员的访问路径被调整为m_cart,
		// 例如:购物车模块中的cart数组的访问路径是m_cart/cart
		m_cart:moduleCart,
		
		// 挂载用户的 vuex 模块，访问路径为 m_user
		m_user:moduleUser,
	}
});

// 4,向外共享Store的实例对象
export default store;