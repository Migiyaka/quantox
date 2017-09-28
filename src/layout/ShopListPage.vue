<template>
    <div class="shop-list">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li class="is-active"><a href="#" aria-current="page">Shop List</a></li>
            </ul>
        </nav>
        <h1 class="title">Open coffee shops near you</h1>
        <div class="sorting">
            <div class="level">
                <div class="level-left">Sort by</div>
                <div class="level-right">
                    <div class="select">
                        <select v-model="sortOrder">
                            <option value="price-desc">Price, more expensive first</option>
                            <option value="price-asc">Price, cheaper first</option>
                            <option value="distance-asc">Distance, closer first</option>
                            <option value="distance-desc">Distance, further first</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="shops" v-if="shopsLoaded">
            <div class="shops-links columns is-multiline" v-if="shops.length > 0">
                <router-link tag="a" :to="`details/${shop.venue.id}`" class="column is-3-fullhd is-6-widescreen is-6-desktop is-6-tablet is-12-mobile" 
                        v-for="(shop, shopIndex) in shops" v-if="shopIndex < 10" :key="shopIndex">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img :src="shopPhotoSource(shop)" :alt="`${shop.venue.name} cover photo`" :title="`${shop.venue.name} cover photo`">
                            </figure>
                        </div>
                        <div class="card-content">
                            <div class="content">
                                <div class="level">
                                    <div class="level-left is-size-4">{{ shop.venue.name }}</div>
                                    <div class="level-right is-size-6">{{ shop.venue.location.distance }}m away</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="shop-error" v-if="shops.length == 0">
                <div class="notification is-danger">No shops found.</div>
            </div>
        </div>
        <div class="shops-loading" v-if="!shopsLoaded">
            <i class="fa fa-circle-o-notch fa-spin"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                shops: [],
                shopsLoaded: false,
                sortOrder: 'price-desc'
            }  
        },
        computed: {
            userPosition() {
                return this.$store.state.app.userPosition;
            }
        },
        watch: {
            sortOrder() {
                this.findNearbyCoffeeShops();
            }  
        },
        created() {
            this.findNearbyCoffeeShops();
        },
        methods: {
            findNearbyCoffeeShops() {
                const location = `${this.userPosition.coords.latitude},${this.userPosition.coords.longitude}`;
                
                this.shopsLoaded = false;
                this.$store.dispatch('app/findNearbyCoffeeShops', { location, radius: 1000 })
                    .then((shops) => {
                        if (this.sortOrder.indexOf('distance') >= 0) {
                            this.shops = (this.sortOrder.indexOf('asc') >= 0) ? shops : shops.reverse();
                        } else {
                            this.shops = this.sortShopsByPrice(shops, this.sortOrder.split('-')[1]);
                        }
                        
                        this.shopsLoaded = true;
                    })
                    .catch(() => {
                        this.shops = [];
                        this.shopsLoaded = true;
                    });
            },
            sortShopsByPrice(shops, order) {
                const direction = (order && order === 'desc') ? 1 : -1;
                
                return shops.sort((a, b) => {
                    if (!a.venue.price || !b.venue.price || a.venue.price.tier === b.venue.price.tier) {
                        if (!a.venue.price) {
                            return direction;
                        }

                        if (!b.venue.price) {
                            return -direction;
                        }

                        return 0;
                    }
                    
                    return (a.venue.price.tier < b.venue.price.tier) ? direction : -direction;
                });
            },
            shopPhotoSource(shop) {
                if (shop.venue.photos.count > 0) {
                    const photo = shop.venue.photos.groups[0].items[0];
                    return `${photo.prefix}640x480${photo.suffix}`;
                } else {
                    return 'http://via.placeholder.com/640x480?text=No+image';
                }
            }
        }
    };
</script>