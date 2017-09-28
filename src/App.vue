<template>
    <div class="main-content" v-if="geolocationLoaded">
        <template v-if="geolocation">
            <router-view></router-view>
        </template>
        <template v-else>
            <div class="notification is-danger">Please enable geolocation to access the website.</div>
        </template>
    </div>
</template>

<script>
    export default {
        computed: {
            geolocation() {
                return this.$store.state.app.geolocation;
            },
            geolocationLoaded() {
                return this.$store.state.app.geolocationLoaded;
            }
        },
        created() {
            this.$store.dispatch('server/createServer');
            this.$store.dispatch('app/getUserPosition');
        }  
    };
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
    @import './assets/scss/main.scss';
</style>