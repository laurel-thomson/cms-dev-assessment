Vue.component('part3', {
    template: `
    <div class="grid_container">
        <div v-for="(item, index) in visible" :class="layouts[current_page][index]">
            <div class="listing_header">
                <sup class="header_number">{{start_position+index+1 < 10 ? '0' : ''}}{{start_position+index+1}}.</sup> <h2>&nbsp;{{item.title}}</h2>
             </div>
            <img v-if="item.mediaurl" :src="item.mediaurl" class="thumbnail" alt="Featured Image" @error="setFallbackImageUrl"/>
            <img v-else src="../comps/fallback.jpg" />
        </div>
        <div class="footer">
            <button type="button" id="next" v-on:click="nextClicked($event)" class="toggle_button">Next</button>
            <button type="button" id="prev" v-on:click="prevClicked($event)" class="toggle_button">Prev</button>
        </div>
    </div>
    `,
    data() {
        return {
            listings: [],
            visible: [],
            start_position: 0,
            end_position: 5,
            current_page: 0,
            layouts: [
                ['listing_item_A','listing_item_B','listing_item_B','listing_item_A','listing_item_B'],
                ['listing_item_C','listing_item_C','listing_item_D','listing_item_C','listing_item_C'],
                ['listing_item_A','listing_item_E','listing_item_A'],
                ['listing_item_E','listing_item_E']
            ]
        }
    },
    methods: {
        setFallbackImageUrl(event) {
            event.target.src = "../comps/fallback.jpg"
        },
        nextClicked(event) {
            elements_on_page = this.layouts[this.current_page].length;
            this.current_page = (this.current_page + 1) % this.layouts.length;
            this.start_position = (this.start_position + elements_on_page) % this.listings.length;
            elements_on_page = this.layouts[this.current_page].length;
            this.end_position = (this.start_position + elements_on_page) % this.listings.length;
            if (this.end_position <= this.start_position) {
                this.visible = this.listings.slice(this.start_position).concat(this.listings.slice(0,this.end_position));
            }
            else {
                this.visible = this.listings.slice(this.start_position, this.end_position);
            }
        },
        prevClicked(event) {
            this.current_page = (this.current_page - 1) == -1 ? (this.layouts.length - 1) : (this.current_page - 1);
            elements_on_page = this.layouts[this.current_page].length;
            if (this.start_position - elements_on_page >= 0) {
                this.start_position -= elements_on_page;
            }
            else {
                this.start_position = this.listings.length - (elements_on_page - this.start_position);
            }
            this.end_position = (this.start_position + elements_on_page) % this.listings.length;
            if (this.end_position <= this.start_position) {
                this.visible = this.listings.slice(this.start_position).concat(this.listings.slice(0,this.end_position));
            }
            else {
                this.visible = this.listings.slice(this.start_position, this.end_position);
            }
        },
    },
    mounted () {
        axios
        .get('https://sv-reqres.now.sh/api/listings/?per_page=1')
        .then(response => {
            total = response.data.total;
            axios
            .get('https://sv-reqres.now.sh/api/listings/?per_page='+total)
            .then(response => {
                this.listings = response.data.data;
                this.visible = this.listings.slice(0,5);
            })
        })
    },
})