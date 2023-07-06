<template>
	<view>
		<view class="search-box">
			<!-- 使用uni-ui提供的搜索组件 -->
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoGoodsDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'Search',
		data() {
			return {
				// 延时器的timerId
				timer:null,
				// 搜索关键词
				kw:'',
				// 搜索结果列表
				searchResults:[],
				// 搜索关键词的历史记录
				// kwHistoryList:['a','app','apple'],
				kwHistoryList:[]
			};
		},
		methods:{
			input(e){
				// e是最新的搜索内容
				// 清除timer对应的延时器
				clearTimeout(this.timer);
				
				// 重新启动一个延时器,并把timerId赋值给this.timer
				this.timer = setTimeout(()=>{
					// 如果500毫秒内,没有触发新的输入事件,则为搜索关键词赋值
					this.kw=e;
					this.getSearchList();
				},500)
			},
			// 根据搜索关键词,搜索商品建议列表
			async getSearchList(){
				// 判断关键词是否为空
				if(this.kw === ''){
					this.searchResults=[];
					return;
				}
				// 发起网络请求,获取搜索建议列表
				const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw});
				if(res.meta.status !== 200) return uni.$showMsg();
				this.searchResults = res.message;
				
				this.saveSearchHistory();

			},
			// 跳转到商品详情页
			gotoGoodsDetail(goods_id){
				uni.navigateTo({
					// 指定详情页面的 URL 地址，并传递 goods_id 参数
					url:'/subpkg/goods_detail/goods_detail?goods_id='+goods_id
				})
			},
			// 保存搜索关键词为历史记录
			saveSearchHistory(){
				// 直接把搜索关键词push到kwHistoryList数组中
				// this.kwHistoryList.push(this.kw);
				// 1.将Array数组转换为Set对象
				const set = new Set(this.kwHistoryList);
				// 2.调用Set对象的delete方法，移除对应的元素
				set.delete(this.kw);
				// 3.调用Set对象的add方法，向Set中添加元素
				set.add(this.kw);
				// 4.将Set对象转化为Array数组
				this.kwHistoryList = Array.from(set);
				
				// 调用uni.setStorageSync(key,value)将搜索历史记录持久化存储到本地
				uni.setStorageSync('kw',JSON.stringify(this.kwHistoryList));
			},
			// 清空搜索历史记录
			cleanHistory(){
				// 清空保存的搜索历史
				this.kwHistoryList = [];
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('kw','[]');
			},
			// 点击跳转到商品列表界面
			gotoGoodsList(kw){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		computed:{
			// 注意：由于数组是引用类型，所以不要直接基于原数组调用reverse方法，以免修改原数组中元素的顺序。
			// 新建一个内存无关的数组，再进行reverse反转
			historys(){
				return [...this.kwHistoryList].reverse();
			}
		},
		onLoad() {
			this.kwHistoryList = JSON.parse(uni.getStorageSync('kw')||'[]');
		}
	}
</script>

<style lang="scss">
	.uni-searchbar {
	  /* #ifndef APP-NVUE */
	  display: flex;
	  /* #endif */
	  flex-direction: row;
	  position: relative;
	  padding: 16rpx;
	  /* 将默认的 #FFFFFF 改为 #C00000 */
	  background-color: #c00000;
	}
	.search-box{
		position: sticky;
		top:0;
		z-index: 999;
	}
	.sugg-list{
		padding: 0 5px;
		.sugg-item{
			font-size: 12px;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 30px;
			.goods-name{
				// 文字不允许换行(单行文本)
				white-space: nowrap;
				// 文字溢出部分隐藏
				overflow: hidden;
				// 文字溢出后使用...代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
	.history-box{
		padding: 0 5px;
		.history-title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}
		.history-list{
			display: flex;
			flex-wrap: wrap;
			.uni-tag{
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
