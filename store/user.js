export default {
	namespaced:true,
	
	// state数据
	state:() => ({
		// 收货地址,读取本地的收货地址数据
		address:JSON.parse(uni.getStorageSync('address')||'{}'),
	}),
	
	// 模块的mutations方法
	mutations:{
		// 更新收货地址
		updateAddress(state,address){
			state.address = address;
			
			this.commit('m_user/saveAddressToStorage');
		},
		// 定义将address持久化存储到本地的mutations方法
		saveAddressToStorage(state){
			uni.setStorageSync('address',JSON.stringify(state.address));
		}
	},
	
	// 数据包装器
	getters:{
		// 收货详情地址的计算属性
		addstr(state){
			if(!state.address.provinceName) return '';
			return state.address.provinceName+state.address.cityName+state.address.countyName+state.address.detailInfo;
		}
	}
}