import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import tw from 'twrnc';
import MapView,{Marker} from 'react-native-maps'
import { useSelector } from 'react-redux';
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import { useDispatch } from 'react-redux';

const API_KEY = process.env.GOOGLE_MAPS_APIKEY;


const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination)
    const mapRef =  useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!origin || !destination) return;
      
        mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
          edgePadding: {top: 50, right: 50, botton: 50, left:50},
        });
      }, [origin, destination]);

      useEffect(() => {
        if (!origin || !destination) return;
      
        const getTravelTime = async () => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination.description}&origins=${origin.description}&units=imperial&key=${API_KEY}`
            );
            const data = await response.json();
      
            if (data.status === 'OK') {
              const element = data.rows[0].elements[0];
      
              if (element.status === 'OK') {
                
                console.log(element)
      
                dispatch(setTravelTimeInformation(element));
              } else {
                console.log('Error:', element.status);
              }
            } else {
              console.log('Error:', data.status);
            }
          } catch (error) {
            console.log('Error:', error);
          }
        };
      
        getTravelTime();
      }, [origin, destination, API_KEY]);
      
  
    return  (
        <MapView
        ref={mapRef}
          style={tw`flex-1`}
          initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {origin && destination && (
            <MapViewDirections 
                origin={origin.description}
                destination={destination.description}
                apikey={API_KEY}
                strokeWidth={3}
                strokeColor="black"
            />
          )}

          {origin?.location && (
            <Marker 
                coordinate={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                }}
                title='Origin'
                description={origin.description}
                identifier='origin'
            />
          )}
          {destination?.location && (
            <Marker 
                coordinate={{
                    latitude: destination.location.lat,
                    longitude: destination.location.lng,
                }}
                title='Destination'
                description={destination.description}
                identifier='destination'
            />
          )}
        </MapView>

      ) 
  };

export default Map

const styles = StyleSheet.create({})