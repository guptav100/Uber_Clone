import { StyleSheet, Text, SafeAreaView, View,Image } from 'react-native'
import React,{useState}  from 'react'
import tw from 'twrnc';
import { FlatList, TouchableOpacity } from 'react-native';
import {Icon} from "react-native-elements"
import {useNavigation} from "@react-navigation/native"
import { useSelector } from 'react-redux';
import { selectTravelTimeInformation } from '../slices/navSlice';
import 'intl';
import 'intl/locale-data/jsonp/en';

const data = [
  {
    id: "Uber-X-123",
    title: "Mini",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },{
    id: "Uber-XL-456",
    title: "Micro",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
  },{
    id: "Uber-LUX-789",
    title: "Premium",
    multiplier: 1.5,
    image: "https://links.papareact.com/7pf",
  }
]

const SURGE_CHARGE_RATE = 1.5; 

const RideOptionCard = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);


  return (
    <SafeAreaView style={tw`bg-white flex-grow`} >
      <View>
      <TouchableOpacity 
        onPress={() => navigation.navigate("NavigateCard")}
        style={tw`top-3 right-40 mt-1 -mb-2`}>
        <Icon name="chevron-left" type="fontawesome" />
      </TouchableOpacity>
      <Text style={tw`text-center text-xl`} >Select a Ride - {travelTimeInformation?.distance.text}</Text>
      </View>

      <FlatList data={data} 
        keyExtractor={(item) => item.id}
        renderItem={({item: {id, title, multiplier, image }, item}) => (
          <TouchableOpacity 
          onPress={() => setSelected(item)}
          style={tw`flex-row justify-between items-center px-3  
          ${id===selected?.id && "bg-gray-200" }`}
          >
            <Image 
              style={{
                width: 90,
                height: 100,
                resizeMode: "contain",
                marginRight: 3,
               
              }}
              source={{uri: image}}
            />
            <View style={tw`-ml-6`}>
              <Text style={tw`text-xl font-semibold`}>{title}</Text>
              <Text>{travelTimeInformation?.duration.text} travel time</Text>
            </View>
            <Text style={tw`text-xl`}>
            
              {new Intl.NumberFormat('en-gb', {
                style: 'currency',
                currency: 'inr',
              }).format(

                (travelTimeInformation?.duration.value * SURGE_CHARGE_RATE * multiplier) 
              )}
            
            </Text>
          </TouchableOpacity>
        )}
      />
      <View>
        <TouchableOpacity
          disabled={!selected}
          style={tw`bg-black py-3 m-1 ml-10 mr-10 ${!selected && "bg-gray-300"} `}>
            <Text style={tw`text-center text-white text-xl -m-2`}>Choose {selected?.title}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

export default RideOptionCard

const styles = StyleSheet.create({})