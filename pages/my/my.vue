<template>
	<view>
		MY
	</view>
</template>

<script>
	// 导入自己封装的mixin模块
	import badgeMixin from '@/mixins/tabbar-badge.js';
	
	export default {
		// 将badgeMxin混入到当前的页面中使用
		mixins:[badgeMixin],
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
