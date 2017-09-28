<template>
    <div class="shop-details">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><router-link tag="a" to="/">Shop List</router-link></li>
                <li class="is-active"><a href="#" aria-current="page">Shop Details</a></li>
            </ul>
        </nav>
        <div class="shop-info" v-if="shopLoaded">
            <template v-if="!shopError">
                <h1 class="title">Shop Details - {{ shop.venue.name }}</h1>
                <div class="box">
                    <div class="columns is-multiline">
                        <div class="column is-6-desktop is-12-tablet is-12-mobile">
                            <div class="slideshow">
                                <div class="slideshow-inner">
                                    <transition name="slide">
                                        <img :src="shopPhotoSource" :key="shopPhotoSource">
                                    </transition>
                                    <div class="slideshow-dots">
                                        <div class="dot" v-for="(photo, index) in shop.venue.photos.groups[0].items"
                                                :class="slideshowDotClass(index)"></div>
                                    </div>
                                </div>
                                <div class="preload-images" v-show="false">
                                    <img v-for="photo in shop.venue.photos.groups[0].items" :src="`${photo.prefix}1024x768${photo.suffix}`">
                                </div>
                            </div>
                        </div>
                        <div class="info column is-6-desktop is-12-tablet is-12-mobile">
                            <h2 class="subtitle is-2">{{ shop.venue.name }}</h2>
                            <h5 class="subtitle is-5">{{ shop.venue.location.distance }}m away</h5>
                            <h4 class="subtitle is-4">Average price: {{ averagePrice }}</h4>
                            <div class="user-tips">
                                <h3 class="subtitle is-3">User tips:</h3>
                                <div class="user-tip" v-for="tip in userTips">
                                    <span class="tip-text">"{{ tip.text }}"</span>
                                    <span class="tip-author">- {{ tip.user.firstName}} {{ tip.user.lastName }}</span>
                                </div>
                                <p v-if="userTips.length == 0">Users have left no coffee related tips for this shop.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="notification is-danger">Error fetching shop details. Please check your URL.</div>
            </template>
        </div>
        <div class="shops-loading" v-if="!shopLoaded">
            <i class="fa fa-circle-o-notch fa-spin"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                shop: {},
                shopLoaded: false,
                shopError: false,
                currentPhotoIndex: 0
            }
        },
        computed: {
            userPosition() {
                return this.$store.state.app.userPosition;
            },
            shopPhotoSource() {
                if (this.shop.venue.photos.count > 0) {
                    const photo = this.shop.venue.photos.groups[0].items[this.currentPhotoIndex];
                    return `${photo.prefix}1024x768${photo.suffix}`;
                } else {
                    return 'http://via.placeholder.com/1024x768?text=No+image';
                }
            },
            averagePrice() {
                if (this.shop.venue.price) {
                    switch (this.shop.venue.price.tier) {
                        case 1:
                            return '< $10 an entree';
                            break;
                        case 2:
                            return '$10-$20 an entree';
                            break;
                        case 3:
                            return '$20-$30 an entree';
                            break;
                        case 4:
                            return '$30 an entree';
                            break;
                        default:
                            return '< $10 an entree';
                    }
                } else {
                    return 'no price info for this shop';
                }
            },
            userTips() {
                return this.shop.venue.tips.groups[0].items.filter(tip => tip.text.toLowerCase().indexOf('coffee') >= 0)
            }
        },
        created() {
            this.findShopInfo();
        },
        methods: {
            findShopInfo() {
                this.shop = {};
                this.shopLoaded = false;
                this.shopError = false;

                const location = `${this.userPosition.coords.latitude},${this.userPosition.coords.longitude}`;

                this.$store.dispatch('app/findShopInfo', { location, shopId: this.$route.params.shopId })
                    .then((shop) => {
                        this.shop = shop;
                        this.shopLoaded = true;
                        this.shopError = false;

                        this.slideShopImages();
                    })
                    .catch(() => {
                        this.shop = {};
                        this.shopLoaded = true;
                        this.shopError = true;
                    });
            },
            slideShopImages() {
                if (this.shopLoaded && !this.shopError) {
                    const photosCount = this.shop.venue.photos.groups[0].items.length;
                    const maxNum = (photosCount > 10) ? 10 : photosCount;

                    setInterval(() => {
                        this.currentPhotoIndex += 1;

                        if (this.currentPhotoIndex >= photosCount) {
                            this.currentPhotoIndex = 0;
                        }
                    }, 5000);
                }
            },
            slideshowDotClass(dotIndex) {
                return (dotIndex == this.currentPhotoIndex) ? 'selected' : '';
            }
        }
    };
</script>