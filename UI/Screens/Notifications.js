import React, {useEffect, useState, useRef} from 'react'
import { SafeAreaView, View, Image, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import TText from '../Components/TText'
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import * as NotificationsL from "expo-notifications";

import { IPAddress, role, userID } from '../global/global';
import Appbar from '../Components/Appbar';


export default function Notifications({route}) {
  
  const navigation = useNavigation();
  // const {user, role} = route.params;
  const [notifications, setNotifications] = useState([])
  const [notificationIDClicked, setNotificationIDClick] = useState(null)
  const notificationListener = useRef();
  const scrollToTop = useRef()
  // useScrollToTop(scrollToTop)

  let notificationListEndIndex = notifications.length - 1

  let listViewRef;

  // use useEffect for componentDidMount or for when the page loads
  useEffect(() => {
    fetchNotificationList()

    // still load notification even when page is not in focus
      // return () => {
      //   fetchNotificationList()
      // }
  }, [])


  // update notification page within receiving of the notification
  // notificationListener.current =
  //   NotificationsL.addNotificationReceivedListener(() => {
  //     fetchNotificationList()    
  // });

  function fetchNotificationList () {
    fetch("http://" + IPAddress + ":3000/notification/" + global.deviceExpoPushToken, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
    .then((data) => {
      // console.log("notification list: ", data)
      console.log("res length: ", data.length)
      
      setNotifications([...data])

      let notifCount = 0
      for(read of data){
        if(!read.read){
          notifCount = notifCount + 1
        }
      }
      global.notificationCount = notifCount

    }).catch((err) => {
      console.log("error: ", err.message)
    })
    setTimeout(fetchNotificationList, 5000)
  }

  // useEffect(() => {
  //   console.log(notifications.length)
  //   scrollToTop.current.scrollToIndex({
  //     index: (notifications.length - 1),
  //     animated: true,
  //   })
  // }, [notifications])


  const listHeaderComponent = () => {
    return(
      <View style={styles.header}>
        <Appbar hasPicture={true} menuBtn={true} />

        <View>
          <TText style={styles.headerTitle}>Notifications</TText>
        </View>
      </View>
    )
  }

  const handleNotificationAge = (createdAt) => {
    let notifDate = new Date(createdAt)
    let dateNow = new Date()
    let dateDiff = Math.abs(dateNow.getTime() - notifDate.getTime())

    // convert milliseconds to seconds
    dateDiff = dateDiff / 1000
    // console.log("seconds: ", dateDiff)

    let day = Math.floor(dateDiff / 60 / 60 / 24)
    if(day === 0) {
      console.log("day: ", day)
  
      let hours = Math.floor(dateDiff / 60 / 60 )
      if ( hours === 0 ) {
        let minutes = Math.floor(dateDiff / 60 % 60)
        
        if ( minutes === 0 ) {
          let seconds = Math.floor(dateDiff % 60)
          return `${seconds} seconds ago`
        }
        
        return minutes > 1 ? `${minutes} minutes ago` : `${minutes} minute ago`
      }
        return hours > 1 ? `${hours} hours ago` : `${hours} hour ago`
    }
    return day > 1 ? `${day} days ago` : `${day} day ago`
  }



  return (
    <SafeAreaView style={styles.container}>
        {/* will change to flatlist instead of scrollview for better performance and better rendering of notifications */}

            <View style={styles.header}>
              {/* <Appbar hasPicture={true} menuBtn={true} /> */}

              {/* <TText style={styles.headerTitle}>Notifications</TText> */}
              <View style={styles.btnContainer}>

                  {/* pang render ng notification */}
                  <FlatList 
                    showsVerticalScrollIndicator ={false}
                    showsHorizontalScrollIndicator={false}
                    // ref={scrollToTop.current?.scrollToIndex({index: notifications.length - 1, animated: true})}
                    // initialScrollIndex={1}
                    // inverted={true}
                    ListHeaderComponent={listHeaderComponent}
                    data={notifications.reverse()}
                    keyExtractor={(item) => item._id}
                    renderItem={({item}) => (
                      <View style={styles.btnItemContainer} >
                        <TouchableOpacity style={ item.read ? styles.btnRead : styles.btnUnread}
                        onPress={() => {
                          setNotificationIDClick(item._id)
                          console.log(item)

                          fetchNotificationList()
                          // turn notification.read to true 
                          fetch("http://" + IPAddress + ":3000/notification/" + global.deviceExpoPushToken, {
                            method: "PUT",
                            header: {
                              'content-type': 'application/json',
                            }
                          }).then(() => console.log("all notification read"))
                          .catch((error) => console.log("error: ", error.message))

                          // {
                          //   notification.from === 'service_request' ?
                          //     navigation.navigate("Request", {reqID: notification._id})
                          //     :
                          //     navigation.navigate("Booking", {reqID: notification._id})
                          // }
                        }}
                      >
                          <View style={styles.btnContent}>
                              <Image style={styles.btnImage} source={require('../assets/images/bg-welcome-worker.png')}/>
                              <View style={styles.btnTexts}>
                                <Text numberOfLines={3} style={styles.btnDesc}>
                                  <Text style={styles.btnDescTitle}>
                                    {item.title} 
                                  </Text> 
                                  <Text> </Text>
                                   {item.body}
                                </Text>
                                  <Text style={styles.btnTime}>
                                    {handleNotificationAge(item.createdAt)}
                                  </Text>
                              </View>
                          </View>
                      </TouchableOpacity>
                      </View>
                      )
                    }
                    ListFooterComponent={() => (
                      <View style={{height: 350, marginTop: 20, alignItems: 'center'}}>
                        <TText style={styles.footerTitle}>---- End of List ----</TText>
                      </View>
                    )}
                  />
              </View>
            </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      // justifyContent: 'center', 
      // marginTop: StatusBar.currentHeight, 
      backgroundColor: '#fff',
    },
    header: {
      width: "100%",
      alignItems: 'center', 
    },
    headerTitle: {
      fontFamily: 'LexendDeca_SemiBold',
      marginTop: 20,
      marginBottom: 10,
    },
    btnContainer: {
      width: "100%",
      marginTop: 40,
      // paddingHorizontal: 30,
    },
    btnContent: {
      flexDirection: 'row', padding: "5%",
    },
    btnItemContainer: {
      width: '100%', 
      paddingHorizontal: 35,
    },
    btnUnread: {
      elevation: 4, 
      backgroundColor: '#fff', 
      width: "100%", 
      height: 120, 
      borderWidth: 1, 
      borderColor: 'rgba(217, 103, 43, 0.85)', 
      marginTop: 25, 
      borderRadius: 15, 
    },
    btnRead: {
      elevation: 4, 
      backgroundColor: '#fff', 
      width: "100%", 
      height: 120, 
      borderWidth: 1, 
      borderColor: 'rgba(0,0, 0, 0.05)', 
      marginTop: 25, 
      borderRadius: 15,
    },
    btnImage: {
      width: 80, 
      height: 80, 
      borderRadius: 50, 
      borderWidth: 1, 
      borderColor: 'rgba(0, 0, 0, 0.3)',
    },
    btnTexts: {
      flex: 1, 
      paddingLeft: "4.5%", 
      justifyContent: "space-around",
    },
    btnDesc: {
      fontSize: 14,
    },
    btnDescTitle: {
      fontFamily: 'LexendDeca_SemiBold',
    },
    btnTime: {
      fontSize: 12, 
      color: "rgba(27, 35, 58, 0.75)",
    },
    footerTitle: {
      color: 'lightgray',
      marginTop: 20
    },
  })
