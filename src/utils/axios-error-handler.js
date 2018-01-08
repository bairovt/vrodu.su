'use strict'

module.exports = function(error){
  if (error.response) {
    // The request was made, but the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data.location) {
      this.$router.push(error.response.data.location) // todo: доделать редирект
    } else if (error.response.status === 401) { // ie. invalid jwt token
      // console.error(error.response.data.message);
      this.$store.dispatch('signOut');
    } else {
      console.error('data: ', error.response.data);
      // console.log('headers: ', error.response.headers);
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Something happened in setting up the request: ' + error);
  }
}