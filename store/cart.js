export default {
	// 为当前模块开启命名空间
	namespaced:true,
	
	// 模块的store数据
	state:()=>({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象,都包含如下6个属性
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart:JSON.parse(uni.getStorageSync('cart')||'[]'),
	}),
	// 模块的mutations方法
	mutations:{
		// 商品加入到购物车
		addToCart(state,goods){
			// 根据提交的商品ID,查询购物车中是否存在这件商品
			// 如果不存在，则findResult为undefined;否则，为查找到的商品信息对象
			const findResult = state.cart.find((x)=>x.goods_id === goods.goods_id);
			
			
			if(!findResult){
				// 如果购物车中没有这件商品,则直接push
				state.cart.push(goods);
			}else{
				// 如果购物车中有这件商品,则只更新该商品的数量即可
				findResult.goods_count++;
			}
			// 通过commit方法,调用m_cart模块下的saveCartToStorage方法
			this.commit('m_cart/saveCartToStorage');
		},
		// 将购物车中的数据持久化存储到本地
		saveCartToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart));
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state,goods){
			// 根据goods_id查询购物车中对应商品的信息对象
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id);
			
			// 有对应的商品信息对象
			if(findResult){
				// 更新对应商品的勾选状态
				findResult.goods_state=goods.goods_state;
				// 持久化存储到本地
				this.commit('m_cart/saveCartToStorage');
			}
		},
		// 更新购物车中商品的数量
		updateGoodsCount(state,goods){
			// 根据goods_id查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id);
			
			if(findResult){
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count;
				
				// 持久化存储到本地
				this.commit('m_cart/saveCartToStorage');
			}
		},
		// 根据商品ID从购物车中删除对应的商品信息
		removeGoodsById(state,goods_id){
			// 调用数组的filter方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== goods_id);
			// 持久化存储到本地
			this.commit('m_cart/saveCartToStorage');
		},
		// 更新购物车中所有商品的勾选状态
		updateAllGoodsState(state,newState){
			// 循环更新购物车中每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState);
			
			// 持久化存储到本地
			this.commit('m_cart/saveCartToStorage');
		}
	},
	
	// 模块的getters属性
	getters:{
		// 统计购物车中商品的总数量
		total(state){
			let c = 0;
			// 循环统计商品的数量,累加到变量c中
			state.cart.forEach(goods => c += goods.goods_count);
			
			return c;
		},
		// 统计购物车中勾选商品的总数量
		checkedCount(state){
			// 先使用filter方法 ,从购物车中过滤已勾选的商品
			// 再使用reduce方法,将已勾选的商品总数量进行累加
			// reduce的返回值 就是已勾选的商品总数量
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count,0);
		},
		// 购物车中已购选商品的总价
		checkedGoodsAmount(state){
			// 先使用filter方法,从购物车中过滤已勾选的商品
			// 再使用reduce方法,将已勾选商品数量*单价之后,进行累加
			// reduce的返回值 就是已勾选的商品总价
			// 最后调用toFixed(2)方法，保留两位小数
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total+= item.goods_count*item.goods_price,0).toFixed(2);
		}
	}
}