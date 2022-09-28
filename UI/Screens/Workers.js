import { StyleSheet, Dimensions, View, SafeAreaView, Modal, ActivityIndicator, Image, StatusBar, TouchableOpacity, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import Appbar from '../Components/Appbar'

import { FlashList } from '@shopify/flash-list'
import { IPAddress } from '../global/global'
import { ModalPicker } from '../Components/ModalPicker'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Workers = () => {

  const [listOfWorkers, setListOfWorkers] = useState([])
  const [listOfWorksOfWorker, setListOfWorksOfWorker] = useState([])

  const [barangayFilter, setBarangayFilter] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")

  const [barangayViewModal, setBarangayViewModal] = useState(false)
  const [verifiedViewModal, setVerifiedViewModal] = useState(false)
  const [categoryViewModal, setCategoryViewModal] = useState(false)
  const [ratingViewModal, setRatingViewModal] = useState(false)
  const [hasFilter, setHasFilter] = useState(barangayFilter || verifiedFilter || categoryFilter || ratingFilter)

  const changeModalVisibility = (bool) => {
    setBarangayViewModal(bool)
    setVerifiedViewModal(bool)
    setCategoryViewModal(bool)
    setRatingViewModal(bool)
  }


  useEffect(() => {
    fetch("http://" + IPAddress + ":3000/Worker", {
        method: "GET",
        headers: {
            "content-type": "application/json"
        },
    }).then((response) => response.json())
    .then((data) => {
        setListOfWorkers([...data])
        console.log("list of workers: ", data)
    })
}, [])

useEffect(() => {
    setHasFilter(barangayFilter || verifiedFilter || categoryFilter || ratingFilter)
  },[barangayFilter, verifiedFilter, categoryFilter, ratingFilter])


  const handleResetFilter = () => {
    setBarangayFilter("")
    setVerifiedFilter("")
    setCategoryFilter("")
    setRatingFilter("")
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.box}>
        <Appbar hasPicture={true} backBtn={true} accTypeSelect={true} showLogo={true} />
        
        <View style={styles.listContainer}>
          <View style={styles.header}>
            <TText style={styles.headerTitle}>Workers</TText>
          </View>
          <View style={styles.filterContainer}>
            <View style={styles.filterBox}>
                <TouchableOpacity style={styles.filterBtn}
                    onPress={() => setVerifiedViewModal(true)}
                >
                    <TText style={styles.filterText}>{verifiedFilter ? verifiedFilter :"All"}</TText>
                    <Icon name="chevron-down" size={20} />

                    <Modal
                        transparent={true}
                        animationType='fade'
                        visible={verifiedViewModal}
                        onRequestClose={() => setVerifiedViewModal(false)}
                    >
                        <ModalPicker 
                            changeModalVisibility={changeModalVisibility}
                            setData={(filter) => setVerifiedFilter(filter)}
                            verifiedFilter={true}
                        />
                    </Modal>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}
                    onPress={() => {
                        setBarangayViewModal(true)
                    }}
                >
                    <TText style={styles.filterText}>{barangayFilter ? barangayFilter : "Barangay"}</TText>
                    <Icon name="chevron-down" size={20} />

                    <Modal
                        transparent={true}
                        animationType='fade'
                        visible={barangayViewModal}
                        onRequestClose={() => setBarangayViewModal(false)}
                    >
                        <ModalPicker 
                            changeModalVisibility={changeModalVisibility}
                            setData={(filter) => setBarangayFilter(filter)}
                            barangay={true}
                        />
                    </Modal>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}
                    onPress={() => setCategoryViewModal(true)}
                >
                    <TText style={styles.filterText}>{categoryFilter ? categoryFilter : "Category"}</TText>
                    <Icon name="chevron-down" size={20} />

                    <Modal
                        transparent={true}
                        animationType='fade'
                        visible={categoryViewModal}
                        onRequestClose={() => setCategoryViewModal(false)}
                    >
                        <ModalPicker 
                            changeModalVisibility={changeModalVisibility}
                            setData={(filter) => setCategoryFilter(filter.Category)}
                            categoryFilter={true}
                        />
                    </Modal>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBtn}
                    onPress={() => setRatingViewModal(true)}
                >
                    <TText style={styles.filterText}>{ ratingFilter ? ratingFilter : "Rating"}</TText>
                    <Icon name="chevron-down" size={20} />

                    <Modal
                        transparent={true}
                        animationType='fade'
                        visible={ratingViewModal}
                        onRequestClose={() => setRatingViewModal(false)}
                    >
                        <ModalPicker 
                            changeModalVisibility={changeModalVisibility}
                            setData={(filter) => setRatingFilter(filter)}
                            ratingFilter={true}
                        />
                    </Modal>
                </TouchableOpacity>
            </View>

            {
                hasFilter ? 
                <View style={styles.resetFilterContainer}>
                    <TouchableOpacity style={styles.resetFilterBtn} 
                        onPress={() => handleResetFilter()}
                    >
                        <Icon name='close-circle' size={20} />
                        <TText style={styles.resetFilterTxt}>Reset Filter</TText>
                    </TouchableOpacity>
                </View>
                : null
            }
          </View>
        
            {/* List of workers */}
          <View style={{width: WIDTH, height: HEIGHT, paddingTop: 20,}}>
                <FlashList 
                    data={listOfWorkers}
                    keyExtractor={item => item._id}
                    estimatedItemSize={100}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                        <View style={{width: '100%', paddingHorizontal: 30, height: 130}}>
                            <TouchableOpacity style={styles.button}>
                                <View style={styles.buttonView}>
                                    {/* Profile Picture */}
                                    <View style={styles.imageContainer}>
                                        <Image source={require("../assets/images/plumbing.jpg")} style={styles.image} />
                                    </View>
                                    {/* Worker Information */}
                                    <View style={styles.descriptionBox}>
                                        <View style={styles.descriptionTop}>
                                            <View style={[styles.row, styles.workerInfo]}>
                                                <View style={styles.workerNameHolder}>
                                                    <TText style={styles.workerNameText}>{item.firstname}{item.middlename === "undefined" ? "" : item.middlename} {item.lastname}</TText>
                                                    { !item.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
                                                </View>
                                                <View style={styles.workerRatingsHolder}>
                                                    <Icon name="star" color={"gold"} size={18} />
                                                    <TText style={styles.workerRatings}>4.5</TText>
                                                </View>                                     
                                            </View>
                                            <View style={styles.workerAddressBox}>
                                                <Icon name='map-marker' size={16} />
                                                <TText numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.street}, {item.purok}, {item.barangay}</TText>
                                            </View>
                                        </View>
                                        <View style={styles.descriptionBottom}>
                                            <View style={[styles.serviceFeeText]}> 
                                                <TText numberOfLines={1} ellipsizeMode='tail' style={{fontSize: 13,}}>Services: </TText>
                                                {
                                                    item.works.map(function(w, index){
                                                        return(
                                                            <TText key={index} numberOfLines={1} ellipsizeMode='tail' style={{}}>{w}{index === item.works.length - 1 ? "" : ", "}</TText>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                {/* <TText>Hello</TText>

                <FlashList 
                    data={listOfWorkers}
                    keyExtractor={item => item._id}
                    estimatedItemSize={100}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => (<View style={{height: 180}}></View>)}
                    renderItem={({item}) => (

                    )}
                /> */}
          </View>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default Workers

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite,
    },
    listContainer: {
        width: '100%',
        // paddingHorizontal: 30,
        alignItems: 'center',
    },
    header: {  
        marginTop: 20,
        marginBottom: 30
    },
    headerTitle: {
        fontSize: 20
    },
    filterContainer: {

    },
    filterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        width: '90%',
        elevation: 4,
    },
    filterBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 8,
    },
    filterText: {
    },
    resetFilterContainer: {
        alignItems: 'flex-end',
        marginTop: 15,
    },
    resetFilterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderWidth: 1.2,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10
    },
    resetFilterTxt: {
        marginLeft: 5
    },
    buttonView: {
        // marginHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 4,
        marginBottom: 20,
        // marginHorizontal: 30,
        overflow: 'hidden',
    },
    imageContainer: {
        flex: 1,
        maxWidth: 110,
        maxHeight: 115,
    },
    image: {
        width: '100%',
        height: '100%'
    },
    descriptionBox: {
        flex: 1.9,
        padding: 12,
        width: '100%',
        justifyContent: 'space-between',
    },
    descriptionTop: {
        width: '100%',
        justifyContent: 'space-between',
    },
    row: {

    },
    workerInfo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    workerNameHolder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workerNameText: {
        fontSize: 18,
        marginBottom: 3,
    },
    workerRatingsHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    workerRatings: {
        marginLeft: 3
    },
    workerAddressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
    },
    workerAddressText: {
        fontFamily: 'LexendDeca',
        fontSize: 14,
        marginLeft: 3,
        width: '100%',
    },
    descriptionBottom: {
        width: '90%',
        flexDirection: 'row',
    },
    serviceFeeText: {
        flex: 1,
        width:'100%',
        // height: 22,
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    serviceFeePrice: {
        fontFamily: 'LexendDeca_Medium'
    },
})