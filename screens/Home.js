import React, { useEffect, useState } from "react";
import {SliderBox} from 'react-native-image-slider-box';
import List from '../components/List';
import Error from '../components/Error';
import {
    ActivityIndicator,
    view,
    StyleSheet,
    Dimansions,
    Scrollview,
} from 'react-native';

import {
    getPopularMovies,
    getUpcomingMovies,
    getPopularTv,
    getFamilyMovies,
    getDocumentaryMovies,
  } from "../services/service";
  

  const dimentions = Dimensions.get('screen');
  
const Home = ({navigation}) => {
  const [moviesImages, setMoviesImages] = useState();
  const [popularMovies, setPopularMovies] = useState();
  const [popularTv, setPopularTv] = useState();
  const [familyMovies, setFamilyMovies] = useState();
  const [documentaryMovies, setDocumentaryMovies] = useState();

  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getData = () => {
    return Promise.all([
        getPopularMovies(),
        getUpcomingMovies(),
        getPopularTv(),
        getFamilyMovies(),
        getDocumentaryMovies(),
    ]);
  };

  useEffect(() => {
    getData()
      .then(
        ([
          upcomingMoviesData,
          popularMoviesData,
          popularTvData,
          familyMoviesData,
          documentaryMoviesData,
        ]) => {
          const moviesImagesArray = [];
          upcomingMoviesData.forEach(movie => {
            moviesImagesArray.push(
              'https://image.tmdb.org/t/p/w500' + movie.poster_path,
            );
          });

          setMoviesImages(moviesImagesArray);
          setPopularMovies(popularMoviesData);
          setPopularTv(popularTvData);
          setFamilyMovies(familyMoviesData);
          setDocumentaryMovies(documentaryMoviesData);
        },
      )
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  return (
    <React.Fragment>
      {/* Upcoming Movies */}
      {loaded && !error && (
        <Scrollview>
          {moviesImages && (
            <view style={styles.sliderContainer}>
              <SliderBox
                images={moviesImages}
                dotStyle={styles.sliderStyle}
                sliderBoxHeight={dimentions.height / 1.5}
                autoplay={true}
                circleLoop={true}
              />
            </view>
          )}
          {/* Popular Movies */}
          {popularMovies && (
            <view style={styles.carousel}>
              <List
                navigation={navigation}
                title={'Películas populares entre el público'}
                content={popularMovies}
              />
            </view>
          )}
          {/* Popular TV Shows */}
          {popularTv && (
            <view style={styles.carousel}>
              <List
                navigation={navigation}
                title={'Programas de TV populares'}
                content={popularTv}
              />
            </view>
          )}
          {/* Family Movies */}
          {familyMovies && (
            <view style={styles.carousel}>
              <List
                navigation={navigation}
                title={'Películas familiares'}
                content={familyMovies}
              />
            </view>
          )}
          {/* Documentary Movies */}
          {documentaryMovies && (
            <view style={styles.carousel}>
              <List
                navigation={navigation}
                title={'Documentales'}
                content={documentaryMovies}
              />
            </view>
          )}
        </Scrollview>
      )}
      {!loaded && <ActivityIndicator size="large" />}
      {error && <Error />}
    </React.Fragment>
  );
};
  



const styles = StyleSheet.create({
    sliderContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
    
    },
   sliderStyle: {
       height: 0,
   
  },
   carousel: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
   
  },
});


   export default Home 