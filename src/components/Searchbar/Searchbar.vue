<template>
	<div class="dk__search-container">
		<form
			@submit.prevent="
				validate();
				searchRedirect($event);
			"
			:style="searchbarStyles"
		>
			<input
				type="search"
				:placeholder="defaultPlaceholder"
				name="searchbar"
				v-model="search"
				:style="{ backgroundColor: background }"
				@keyup="$emit('search-value', search)"
			/>
			<div v-if="icon" class="dk__search-submit">
				<SearchIcon
					@click.native="
						validate();
						searchRedirect($event);
					"
					:iconColor="iconColor"
				/>
			</div>
		</form>
	</div>
</template>
<script>
import SearchIcon from './SearchIcon';
export default {
	name: 'Searchbar',
	components: {
		SearchIcon,
	},
	props: {
		searchFunction: Function,
		placeholder: String,
		icon: {
			type: Boolean,
			default: true,
		},
		iconColor: String,
		styles: {
			type: Object,
			default: () => ({}),
		},
		background: {
			type: String,
		},
	},
	data() {
		return {
			search: '',
			defaultPlaceholder: this.placeholder || 'Search...',
			searchbarStyles: { ...this.styles },
		};
	},
	methods: {
		searchRedirect(e) {
			if (this.searchFunction) return this.searchFunction(this.search);
			if (this.search !== '' && this.$route.query.search !== this.search) {
				this.$router.push({
					name: 'Search',
					query: { search: this.search.split(' ').join('-') },
				});
			}
		},
		validate() {
			this.defaultPlaceholder = this.search === '' ? 'Invalid search...' : 'Search...';
		},
	},
};
</script>
<style scoped lang="scss">
.dk__search-container {
	@include flex-x(center);
	width: 33%;
	height: 100%;
}
form {
	@include flex-x(false, center);
}
input[type='search'] {
	padding: 5px 50px 5px 15px;
	max-width: 18rem;
	height: 35px;
	font: 12px $font_primary;
	border: none;
	border-bottom: 1px solid lighten($black, 70%);
	background-color: transparent;
	background: linear-gradient(to bottom, $primary 0%, $primary 100%);
	background-position: 0 100%;
	background-repeat: repeat-x;
	background-size: 0px 0px;
	transition: all 0.5s;
	outline: none;
	-webkit-appearance: none;
}
input[type='search']:focus {
	color: $white;
	background-size: 4px 45px;
}
.dk__search-submit {
	@include flex-x(false, center);
	width: 36px;
	height: 36px;
}
svg {
	cursor: pointer;
	margin-left: -35px;
	padding: 1px;
	width: 20px;
	height: 20px;
	text-align: center;
	font-size: 14px;
	z-index: 1;
	transform: scale(0.8);
	border-radius: unset;
	transition: transform 0.3s;
}
svg:hover {
	transform: scale(1);
}
::placeholder {
	color: $white;
}
:-ms-input-placeholder {
	/* Internet Explorer 10-11 */
	color: $white;
}
::-ms-input-placeholder {
	/* Microsoft Edge */
	color: $white;
}
</style>
