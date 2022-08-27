import React, {useRef, useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, 
  Image, Button, StyleSheet, StatusBar, ScrollView, Modal, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ModalPicker } from '../Components/ModalPicker';

import * as ImagePicker from 'expo-image-picker';
import { AssetsSelector } from 'expo-images-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import dayjs from 'dayjs';
import Appbar from '../Components/Appbar';
import TText from '../Components/TText';
import ConfirmDialog from '../Components/ConfirmDialog';

import ThemeDefaults from '../Components/ThemeDefaults';
import ModalDialog from '../Components/ModalDialog';
import ImagesPicker from '../Components/ImagesPicker';
import { IPAddress } from '../global/global';
import OTPVerification from './OTPVerification';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function Registration({route}) {

    const {userType} = route.params;

    const navigation = useNavigation();
    
    const [user, setUser] = useState({
      username: "", password: "", email: "", firstname: "",
      lastname: "", birthday: "", age: "", gender: "", street: "",
      purok: "", barangay: "", city: "Daet", province: "Camarines Norte", phonenumber: "+63",
      role: userType,
    })

    const [confirmPW, setConfirmPW] = useState("")
    const [pwMatch, setPWMatch] = useState(true);

    useEffect(() => {
      user.password === confirmPW ? setPWMatch(true) : setPWMatch(false)
    }, [confirmPW, user.password])

    const [placeholderPhoneNum, setPlaceholderPhoneNum] = useState("Phone Number")
    const [phoneVerified, setPhoneVerified] = useState(false);

    const handlePhoneVerification = (isverified) => {
      setPhoneVerified(isverified)
    }

    const [next, setNext] = useState(1)
    const [nextNum, setNextNum] = useState(1)

    const updateNextNum = () => {
      setNextNum(next)
    }

    const [isConfirm, setisConfirm] = useState(false)
    const [chooseData, setchooseData] = useState("")
    const [chooseBarangay, setchooseBarangay] = useState("")
    const [services, setServices] = useState([
      {
        service:"",
      },
    ])

    const [isModalVisible, setModalVisible] = useState(false)
    const [isUnlistedModalVisible, setUnlistedModalVisible] = useState(false)
    const [showAddUnlistedServiceModal, setshowAddUnlistedServiceModal] = useState(true)
    const [hasBlanks, sethasBlanks] = useState(false)
    
    const [showDialog, setShowDialog] = useState(false)
    const [isConfirmed, setisConfirmed] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())
    const [dateSelected, setSelected] = useState(false)

    const [datePickerVisible, setDatePickerVisibility] = useState(false);

    const handleServiceAdd = () => {
      setServices([...services, {service: "", lowestPrice: "", highestPrice: ""}])
      haveBlanks()
    }

    const handleServiceSelect = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      console.log("val handle service: ", val)

      if(val.sub_category === "unlisted"){
        list[index]['category'] = 'unlisted'
      } else {
        console.log("val: ", val.Category)
  
        list[index]['service'] = val.ServiceSubCategory;
        list[index]['category'] = val.ServiceID.Category;
        setServices(list)
      }
      haveBlanks()

      console.log(services)
    }

    const handleServiceChange = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      if (val.sub_category === "Unlisted (Add new subcategory)"){
        list[index]['status'] = "unlisted";
        list[index]['service'] = "";
        list[index]['category'] = "";
        setUnlistedModalVisible(true)
      } else {
        if (list[index]['status'] === "unlisted"){
          list[index]['service'] = val.sub_category;
          list[index]['status'] = "";
          list[index]['category'] = "";
        }
        list[index]['service'] = val.sub_category;
        list[index]['category'] = val.category;
      }
      setServices(list)
      haveBlanks()

      console.log(services)
    }

    const handleServiceLowPrice = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      list[index]['lowestPrice'] = val;
      setServices(list)
      console.log("lowPrice: ", services)
      haveBlanks()
    }

    const handleServiceHighPrice = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      list[index]['highestPrice'] = val;
      setServices(list)
      console.log("highPrice: ", services)
      haveBlanks()
    }

    const handleServiceUnlisted = (val, index) => {
      const list = [...services];
      list[index]['service'] = val
      setServices(list)
      console.log("unlisted: ", services)
      haveBlanks()
    }

    const handleServiceRemove = (index) => {
      const list = [...services];
      console.log(list)
      list.splice(index, 1);
      setServices(list)
      console.log(list)

      haveBlanks()
    }

    const handleRemoveImage = (index) => {
      const list = [...image]

      list.splice(index, 1)
      console.log(list)
      
      setImage(list)
    }

    const haveBlanks = () => {
      let arr = Object.values(services)      
      let arrUser = Object.values(user)
      let arrUser2 = Object.values(arrUser)
      let userJ = 1, job;

      console.log("arr: ", arr)
      console.log("arrUser: ", Object.values(arrUser2))

      for(let el of arr){
        job = Object.values(el).includes("") ? 0 : 1
      }

      for(let el of arrUser2){
        console.log("el of arrUser2: ", el)
        // userJ = el.includes("") ? 0 : 1
        if(el.length === 0){
          userJ = 0
        } 
      }

      if(user.role == "recruiter"){
        if(userJ === 1) {
          sethasBlanks(false)
          // setShowDialog(true)
        } else {
          sethasBlanks(true)
          // show modal/error message to not leave any form "unasnswered"
          // setShowDialog(false)
        }

        // console.log("userJ: ", r)
      } else (job+userJ) === 2 ? sethasBlanks(true) : sethasBlanks(false)
      console.log(job + " " + userJ)
    }

    const setData = (option) => {
      setchooseData(option)
      setUser((prev) => ({...prev, gender: option}))
      haveBlanks()
    }

    const setBarangay = (option) => {
      setchooseBarangay(option)
      setUser((prev) => ({...prev, barangay: option}))
      haveBlanks()
    }

    const setServiceOffered = (option) => {
      setServices(option)
    }

    const didConfirm = (isConfirmed) => {
      setisConfirmed(true)
      console.log("didConfirm")
    }
   
    const changeModalVisibility = (bool) => {
      setModalVisible(bool)
    }

    const changeModalDialogVisibility = (bool) => {
      setShowDialog(bool)
      // setUnlistedModalVisible(bool)
    }

    // const changeModalServiceVisibility = (bool) => {
    //   setModalServiceVisible(bool)
    // }

    const handleConfirm = (date) => {
      let dateString = dayjs(date).format("YYYY-MM-DD").toString()
      setFormatedDate(...dateString);
      setDisplayDate(dayjs(date).format("MMM D, YYYY"));
      setDatePickerVisibility(false);
      setSelected(true)

      setUser((prev) => ({...prev, birthday: formatedDate}))

      haveBlanks()
      console.log(displayDate)
    };

    // OPEN IMAGE PICKER
    // multi ID images
    const [image, setImage] = useState([]);
    //single ID image
    const [singleImage, setSingleImage] = useState('');
    // multi license images
    const [imagelicense, setLicenseImage] = useState([]);
    //single license image
    const [imageSingleLicense, setSingleLicenseImage] = useState('');

    // const [imageW, setImageW] = useState(Number);
    // const [imageH, setImageH] = useState(Number);
    // let imageList = [];

    const [isPriceGreater, setIsPriceGreater] = useState(true)
    useEffect(() => {
      console.log("hp", services[0].highestPrice)
      if(services[0].highestPrice > services[0].lowestPrice){
        setIsPriceGreater(true)
      } else {
        setIsPriceGreater(false)
      }
    }, [services.lowestPrice, services.highestPrice])

    useEffect(() => {
      (async () => {
        if (Platform.OS !== "web") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            // await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();
    }, []);

    const pickImage = async () => {

      let result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        // selectionLimit: 1, // ios only
        aspect: [4,3],
        quality: 0.5,
      });

      console.log("selected", result.selected);

      if (!result.cancelled) {
        if(!result.selected && next !== 3) {
          setSingleImage(result.uri)
          setImage([])
        }
        else if(next === 3) {
          if(!result.selected) {
            setSingleLicenseImage(result.uri)
            setLicenseImage([])
          }
          else {
            setLicenseImage([...result.selected])
            setSingleLicenseImage("")
          }
        }
        else {
          setImage([...result.selected])
          setSingleImage("")
        }
      }
      console.log("Image state: ", image)
    };

    // references for textinput onSubmit
    const ref_email = useRef();
    const ref_pw = useRef();
    const ref_cpw = useRef();
    const ref_fn = useRef();
    const ref_mn = useRef();
    const ref_ln = useRef();
    const ref_age = useRef();

    const [loaded] = useFonts({
        LexendDeca: require('../assets/fonts/LexendDeca-Regular.ttf'),
        LexendDeca_Medium: require('../assets/fonts/LexendDeca-Medium.ttf'),
        LexendDeca_SemiBold: require('../assets/fonts/LexendDeca-SemiBold.ttf'),
        LexendDeca_Bold: require('../assets/fonts/LexendDeca-Bold.ttf'),
        LexendDecaVar: require('../assets/fonts/LexendDeca-VariableFont_wght.ttf'),
      });
    
    if (!loaded) {
      return null;
    }    
  
      
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView scrollEnabled={isUnlistedModalVisible ? false:true} style={{ width: '100%', minHeight: HEIGHT, }}>

          <Appbar 
            stateChangerNext={setNext} 
            backBtn={true} hasPicture={false} 
            registration={true} 
            currentRegistrationScreen={nextNum} 
            userType={userType} 
            screenView={next}  />

          {/* Page Header */}
          <View style={styles.header}>
              <TText style={styles.headerTitle}>{userType === "recruiter" ? 'Recruiter' : 'Worker'} Information</TText>
              {
                next == 4 ? 
                <TText style={styles.headerDesc}>Please fill in the form carefully. The details will be needed for verification.</TText>
                : <TText style={styles.headerDesc}>Please fill in your personal information carefully. The details will be needed for verification.</TText>
              }
          </View>

          {/* Modal to confirm the creation of account */}
          {isConfirm ?
              <View style={styles.confirmModal}>
                <View style={styles.confirmBox}>
                  <TText style={styles.confirmModalText}>By clicking confirm, your account will be registered and no further changes can be made upon registration.</TText>
                  <View style={styles.confirmModalBtnContainer}>
                    <TouchableOpacity 
                      style={[styles.confirmModalBtn, styles.confirmModalCancel]}
                      onPress={()=> setisConfirm(false)}
                    >
                      <TText style={styles.confirmModalBtnText}>Cancel</TText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.confirmModalBtn, styles.confirmModalConfirm]}
                      onPress={()=> setisConfirm(false)}
                    >
                      <TText style={[styles.confirmModalBtnText, {color: ThemeDefaults.themeOrange}]}>Confirm</TText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              : null
          }

          {/* modal is shown when user has chosen unlisted category */}
          {
            isUnlistedModalVisible ? 
            <View style={[styles.confirmModal]}>
                <View style={styles.confirmBox}>
                <View style={{padding: 20}}>
                  <TText style={styles.confirmModalText}>By clicking confirm, your account will be registered and no further changes can be made upon registration.</TText>
                  <TText style={[styles.confirmModalText]}>Once approved, your specified service in Custom Service Offered, as well as its price range, will be automatically posted in the application.</TText>
                </View>
                  <View style={styles.confirmModalBtnContainer}>
                    <TouchableOpacity 
                      style={[styles.confirmModalBtn, styles.confirmModalConfirm]}
                      onPress={()=> setUnlistedModalVisible(false)}
                    >
                      <TText style={[styles.confirmModalBtnText, {color: ThemeDefaults.themeOrange}]}>Confirm</TText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              : null
          }

          {
            next == 4 ?
              <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', }}>
                {
                  services.map((serviceOffered, index) => (
                    <View key={index} style={{width: '100%', alignItems: 'center', marginBottom: 30,}}>
                      {
                        services.length > 1 ?
                          <View style={{width: '80%', alignItems: 'flex-end', marginBottom: 5}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: ThemeDefaults.appIcon, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3}}
                              onPress={() => handleServiceRemove(index)}
                            >
                              <TText style={{color: '#a1a1a1'}}>Remove Service</TText>
                              <Icon name="close-circle" size={18} color={'#a1a1a1'} style={{marginLeft: 10}} />
                            </TouchableOpacity>
                          </View> 
                        : null
                      }
                      <View style={[styles.inputContainer, {width: '80%', justifyContent: 'space-evenly', paddingHorizontal: 15}]}>
                        <Icon name='briefcase' size={23} color={"#D0CCCB"} />
                        <TouchableOpacity 
                          onPress={() => changeModalVisibility(true)}
                          style={{
                            width: '100%', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            paddingTop: 8,
                            paddingBottom: 5,
                          }}>
                          <TouchableOpacity 
                            styles={styles.dropdownBtn}
                          >
                          {
                            serviceOffered.service || serviceOffered.status || serviceOffered.category ?
                              <TText style={[styles.ddText, {color:"#000"}]}>{serviceOffered.category ? "Unlisted" : serviceOffered.service}</TText>
                              : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Specific Service Offered</TText>
                          }
                          </TouchableOpacity>
                            <Modal
                              transparent={true}
                              animationType='fade'
                              visible={isModalVisible}
                              onRequestClose={() => changeModalVisibility(false)}
                            >
                              <ModalPicker 
                                changeModalVisibility={changeModalVisibility}
                                setData={(val) => handleServiceSelect(val, index)}
                                services={true}
                              />
                            </Modal>
                            <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} />
                          </TouchableOpacity>
                      </View>
                          
                      {
                        serviceOffered.category === "unlisted" && 
                          <View style={[styles.inputContainer, {width: '80%'}]}>
                              {/* {setUnlistedModalVisible(true)} */}
                              <Icon name='briefcase-outline' size={20} color={"#D0CCCB"} />
                              <TextInput style={styles.input} 
                                placeholder={"Custom Service Offered"}
                                placeholderTextColor={"#A1A1A1"}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                textContentType={'purok'}
                                onChangeText={ (val) => {handleServiceUnlisted(val, index)
                                  haveBlanks()
                                } }
                                onSubmitEditing={ () => ref_cpw.current.focus() }
                                ref={ref_pw} />
                            </View> 
                      }
                      <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={[styles.inputContainer, {width: '48%'}]}>
                            <Icon name='currency-php' size={20} color={"#D0CCCB"} />
                            <TextInput style={[styles.input, {color: isPriceGreater ? 'black' : ThemeDefaults.appIcon}]} 
                              placeholder={"Lowest Price"}
                              placeholderTextColor={"#A1A1A1"}
                              value={serviceOffered.lowestPrice ? serviceOffered.lowestPrice : ""}
                              keyboardType={'numeric'}
                              returnKeyType={"next"}
                              textContentType={'price'}
                              onChangeText={ (val) => {
                                handleServiceLowPrice(val, index)
                                haveBlanks()
                              }}
                              ref={ref_pw} />
                        </View>

                        <View style={[styles.inputContainer, {width: '48%'}]}>
                          <Icon name='currency-php' size={20} color={"#D0CCCB"} />
                          <TextInput style={[styles.input, {color: isPriceGreater ? 'black' : ThemeDefaults.appIcon}]} 
                            placeholder={"Highest Price"}
                            placeholderTextColor={"#A1A1A1"}
                            value={serviceOffered.highestPrice ? serviceOffered.highestPrice : ""}
                            keyboardType={'numeric'}
                            returnKeyType={"next"}
                            textContentType={'price'}
                            onChangeText={ (val) => {
                              handleServiceHighPrice(val, index);
                              haveBlanks()
                            } }
                            ref={ref_cpw} />
                        </View>
                      </View>
                  
                      {/* {
                        services.length - 1 === index &&
                          <View style={{alignItems: 'center', marginTop: 150}}>
                          <TouchableOpacity style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#595959', alignItems: 'center', justifyContent: 'center' ,marginBottom: 15}}
                            onPress={() => {
                              handleServiceAdd()
                              haveBlanks()
                            }}
                          >
                            <Icon name='plus' size={30} color={'white'} />
                          </TouchableOpacity>
                          <TText style={{width: 130, textAlign: 'center'}}>Add another service offered</TText>
                        </View>
                      } */}
                    </View>
                  ))
                }
                
                {
                  !hasBlanks ? 
                  <View style={{marginTop: '8%', marginBottom: '0%'}}>
                    <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>{ !hasBlanks ? "* Please fill in the required fields." : null}</TText>
                    <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>{ !pwMatch ? "* Passwords does not match" : null}</TText>
                  </View> : null
                }

                <View style={[styles.confirm, {width: '90%'}]}>
                  {/* Create Account Button */}
                    <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: hasBlanks && pwMatch ? ThemeDefaults.themeOrange : 'rgba(140, 130, 126, 0.2)', elevation: hasBlanks ? 3 : 0}]} 
                      disabled={hasBlanks && pwMatch ? false : true}
                      onPress={() => {
                        console.log("confirm from worker information work description")
                        haveBlanks()
                        if(hasBlanks){
                          setShowDialog(true)
                        }
                        
                      }}
                    >
                      <TText style={{fontFamily: 'LexendDeca_SemiBold', fontSize: 18, color: ThemeDefaults.themeWhite}}
                        >Create Account</TText>
                    </TouchableOpacity>
                  </View>
                
                { showDialog ?
                  <Modal
                    transparent={true}
                    animationType='fade'
                    visible={showDialog}
                    onRequestClose={() => changeModalDialogVisibility(false)}
                  >
                    <ModalDialog
                      changeModalVisibility={changeModalDialogVisibility}
                      setData={didConfirm}
                      numBtn={2}
                      confirmText={'Confirm'}
                      cancelText={'Cancel'}
                      message={"By clicking confirm, your account will be registered and no further changes can be made upon registration."}
                    />
                  </Modal> : null
                }

                {
                  isConfirmed ? navigation.navigate("OTPVerification", {phoneNum: user.phonenumber, role: user.role, user: user, work: services, singleImage: singleImage, imagelicense: imageSingleLicense}) : null
                }

              </View>
              : null
          }

          {
            next == 3 ? 
              <View style={styles.workDescriptionContainer}>
                <View style={styles.workDescriptionBox}>
                  <TText style={{marginBottom: 15, fontFamily: 'LexendDeca_Medium', fontSize: 18}}>Work Description</TText>
                  <View style={{
                      // minHeight: 150, 
                      backgroundColor: '#F4F4F4',
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      alignItems: 'flex-start',
                      borderRadius: 15,
                      elevation: 3,
                  }}>
                  <TextInput multiline 
                    placeholder='Describe what you do..'
                    style={[styles.inputMultiLine, {
                      fontSize: 18,
                      width: '100%',
                      height: 100,
                      maxHeight: 150,
                      padding: 10,
                      textAlignVertical: 'top',
                    }]}
                    defaultValue={user.workDescription}
                    onChangeText={ (val) => {
                      setUser((prev) => ({...prev, workDescription: val}))
                      haveBlanks()
                    } }
                  />
                  </View>
                </View>

                <View style={{width: '100%', alignItems: 'center', marginBottom: 20}}>
                <View style={{width: '80%', marginTop: 40,}}>
                  <TText style={{fontSize: 18}}>License(s)/Certificate(s):</TText>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity 
                      onPress={pickImage}
                      style={{alignItems: 'center', marginTop: 20, backgroundColor: '#F4F4F4', paddingVertical: 30, borderRadius: 15, elevation: 2, width: '100%'}}
                      >
                      <Icon name="camera-plus" size={40} color={"#E7745D"} style={{marginBottom: 10}} />
                      <TText>Attach photo(s) here</TText>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>

                <View style={{width: '100%', alignItems: 'center', pading: 15, marginTop: 30,}}>
                    <TText style={{alignSelf: 'flex-start', marginLeft: '12%'}}>Uploaded License Images:</TText>
                  {
                    imageSingleLicense ? 
                      <Image source={{uri: imageSingleLicense}} style={{width: 400, height: 300, marginVertical: 20}} />
                    :
                    imagelicense.map(function(item, index) {
                        {/* console.log("item: ", item) */}
                        {/* console.log("image length: ", item.length) */}
                        {/* console.log("index: ", index) */}
                        {/* console.log("image uri: ", item.uri) */}
                        return (
                          <View key={index} style={{padding: 3, marginTop: 15,}}>
                              <TouchableOpacity 
                                onPress={()=> handleRemoveImage(index)}
                                style={{justifyContent: 'flex-end', position: 'absolute', top: 10, right: 10, zIndex: 5, borderWidth: 2, borderColor: ThemeDefaults.themeOrange, borderRadius: 30, backgroundColor: ThemeDefaults.themeOrange }}>
                                <Icon name="close-circle" size={25} color={'white'} style={{paddingHorizontal: 10, paddingVertical: 2}} />
                              </TouchableOpacity>
                            <Image source={{uri: item.uri}} style={{width: 400, height: item.height > 3800 ? item.height / 4 : 300, marginBottom: 20}} />
                          </View>
                        )
                      })
                    }
                </View>

                {/* Next Button */}
                <View style={styles.btnContainer}>
                  {/* Next page button */}
                    <TouchableOpacity
                      style={styles.nextBtn}
                      onPress={() => { 
                        setNext((current) => current + 1)
                      }}
                      >
                      <TText style={styles.nextText}>Next</TText>
                      <Icon name="arrow-right-thin" size={30} color='white' />
                    </TouchableOpacity>
                  </View>
                
              </View>
              : null
          }  

          {next == 2 ? 
            <View>
              {/* Street input */}
              <View style={styles.inputGrp}>
                <View style={[styles.inputContainer]}>
                  <Icon name='road' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Street"}
                      placeholderTextColor={"#A1A1A1"}
                      value={user.street}
                      returnKeyType={"next"}
                      textContentType={'street'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, street: val}))
                        haveBlanks()
                      }}
                      onSubmitEditing={ () => ref_pw.current.focus() } />
                </View>

                {/* Purok input */}
                <View style={styles.inputInRow}>   
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='home-city' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Purok"}
                      placeholderTextColor={"#A1A1A1"}
                      value={user.purok}
                      returnKeyType={"next"}
                      textContentType={'purok'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, purok: val}))
                        haveBlanks()
                      } }
                      // onSubmitEditing={ () => ref_cpw.current.focus() }
                      ref={ref_pw} />
                  </View>

                  {/* Barangay dropdown selection */}
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='domain' size={23}color={"#D0CCCB"} />
                    <TouchableOpacity 
                      onPress={() => changeModalVisibility(true)}
                      style={{
                        width: '85%', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        paddingBottom: 5,
                      }}>
                      <TouchableOpacity 
                        styles={styles.dropdownBtn}
                      >
                      {
                        chooseBarangay ?
                        <TText style={styles.ddText} >{chooseBarangay}</TText>
                        : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Barangay</TText>
                      }
                      </TouchableOpacity>
                        <Modal
                          transparent={true}
                          animationType='fade'
                          visible={isModalVisible}
                          onRequestClose={() => changeModalVisibility(false)}
                        >
                          <ModalPicker 
                            changeModalVisibility={changeModalVisibility}
                            setData={setBarangay}
                            barangay={true}
                          />
                        </Modal>
                        <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} style={{paddingRight: 6}} />
                      </TouchableOpacity>
                  </View>
                </View>

                {/* Municipality input */}
                <View style={styles.inputInRow}>
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='city' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Municipality"}
                      placeholderTextColor={"#000"}
                      value={"Daet"}
                      editable={false}
                      returnKeyType={"next"}
                      textContentType={'firstname'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, city: val}))
                        haveBlanks()
                      } }
                      onSubmitEditing={ () => ref_mn.current.focus() }
                      ref={ref_fn} />
                  </View>
                  
                  {/* Province input */}
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='town-hall' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Province"}
                      placeholderTextColor={"#000"}
                      value={"Camarines Norte"}
                      editable={false}
                      returnKeyType={"next"}
                      textContentType={'middlename'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, province: val}))
                        haveBlanks()
                      } }
                      onSubmitEditing={ () => ref_ln.current.focus() }
                      ref={ref_mn} />
                  </View>
                </View>
                
                {/* Phone Number input */}
                <View style={styles.inputContainer}>
                  {/* <Icon name='phone-classic' size={23} color={"#D0CCCB"} /> */}
                  <Image source={require("../assets/images/ph-flag.png")} style={{width: 25, height: 25, marginRight: 10}}/>
                  <View style={{paddingRight: 12, borderRightWidth: 1}}>
                    <TText>+63</TText>
                  </View>
                  <TextInput style={styles.input} 
                    placeholder={placeholderPhoneNum}
                    placeholderTextColor={"#A1A1A1"}
                    value={user.phonenumber.length > 3 ? user.phonenumber : null}
                    keyboardType={'phone-pad'}
                    returnKeyType={"next"}
                    textContentType={'lastname'}
                    onChangeText={ (val) => {
                      setUser((prev) => ({...prev, phonenumber: val}))
                      haveBlanks()
                    } }
                    onFocus={()=> {
                      setPlaceholderPhoneNum("9123456789")
                      }}
                    // onSubmitEditing={ () => ref_bd.current.focus() }
                    ref={ref_ln} />
                </View>

                <View style={{width: '80%', marginTop: 10}}>
                  <TText style={{fontSize: 18}}>Government Issued ID(s):</TText>
                  <TouchableOpacity 
                    onPress={
                      pickImage
                    }
                    style={{alignItems: 'center', marginTop: 20, backgroundColor: '#F4F4F4', paddingVertical: 30, borderRadius: 15, elevation: 2}}
                    >
                    <Icon name="camera-plus" size={40} color={"#E7745D"} style={{marginBottom: 10}} />
                    <TText>Attach photo(s) here</TText>
                  </TouchableOpacity>
                
                </View>

                <View style={{width: '100%', alignItems: 'center', pading: 15, marginTop: 30,}}>
                {
                    singleImage ? 
                      <Image source={{uri: singleImage}} style={{width: 400, height: 320, marginVertical: 20}} />
                    :
                    image.map(function(item, index) {
                      console.log("item: ", item)
                      {/* console.log("image length: ", item.length) */}
                      console.log("index: ", index)
                      console.log("image uri: ", item.uri)
                      return (
                        <View key={index}>
                            <TouchableOpacity 
                              onPress={()=> handleRemoveImage(index)}
                              style={{justifyContent: 'flex-end', position: 'absolute', top: 10, right: 10, zIndex: 2, borderWidth: 2, borderColor: ThemeDefaults.themeOrange, borderRadius: 30, backgroundColor: ThemeDefaults.themeOrange }}>
                              <Icon name="close-circle" size={25} color={'white'} style={{paddingHorizontal: 10, paddingVertical: 2}} />
                            </TouchableOpacity>
                          <Image source={{uri: item.uri}} style={{width: 400, height: item.height > 3800 ? item.height / 4 : 300, marginBottom: 20}} />
                        </View>
                      )
                    })
                  }
                </View>
                {/* <View>
                  {image && <Image source={{uri: image}} style={{marginTop: 30, width: imageW / 4, height: imageH / 4}} />}
                </View> */}

              </View>

              {
                userType === 'worker' ?
                  <View style={styles.btnContainer}>
                  {/* Next page button */}
                    <TouchableOpacity
                      style={styles.nextBtn}
                      onPress={() => { 
                        // console.log("page 3")
                        setNext((current) => current + 1)
                      }}
                      >
                      <TText style={styles.nextText}>Next</TText>
                      <Icon name="arrow-right-thin" size={30} color='white' />
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={styles.confirm}>
                      {/* Control Message */}
                      <View style={{marginBottom: 15, opacity: hasBlanks ? 1 : 0}}>
                        <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>{haveBlanks ? "* Please fill in all the blanks" : null}</TText>
                        <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>{!pwMatch ? "* Passwords does not match" : null}</TText>
                      </View>
                  {/* Create Account Button */}
                    <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: !hasBlanks ? ThemeDefaults.themeOrange : 'rgba(140, 130, 126, 0.2)', elevation: !hasBlanks ? 3 : 0}]}  
                      disabled={hasBlanks && pwMatch ? true : false}
                      onPress={() => {
                        haveBlanks()
                        setShowDialog(true);
                        
                        // createRecruiterAccount();

                        // isConfirmed ? <OTPVerification verified={phoneVerified} handlePhoneVerification={handlePhoneVerification} /> : null
                        // isConfirmed ? navigation.navigate("OTPVerification", {user: user, phoneNum: user.phonenumber, singleImage: singleImage, image: image})

                      }}
                    >
                      <TText style={{fontFamily: 'LexendDeca_SemiBold', fontSize: 18, color: ThemeDefaults.themeWhite}}
                        >Create Account</TText>
                    </TouchableOpacity>
                  </View>
              }

              
              {/* Checks if the user confirms the creation of his/her account  */}
              {
                isConfirmed ? navigation.navigate("OTPVerification", {user: user, phoneNum: user.phonenumber, singleImage: singleImage, image: image}) : null
              }

              {/* show confirm create account dialog */}
              { showDialog ?
                <Modal
                  transparent={true}
                  animationType='fade'
                  visible={showDialog}
                  onRequestClose={() => changeModalDialogVisibility(false)}
                >
                  <ModalDialog
                    changeModalVisibility={changeModalDialogVisibility}
                    setData={didConfirm}
                    numBtn={2}
                    confirmText={'Confirm'}
                    cancelText={'Cancel'}
                    message={"By clicking confirm, your account will be registered and no further changes can be made upon registration."}
                  />
                </Modal> : null
              }
            </View> 
            : null
          }
          {
            next == 1 ?
            <View>
            <View style={styles.inputGrp}>
              {/* Username input */}
              <View style={styles.inputContainer}>
                <Icon name='account-circle' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Username (eg. juan_dcruz, juanDC)"}
                  value={user.username ? user.username : null}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  textContentType={'username'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, username: val}))
                    haveBlanks()
                    } }
                  onSubmitEditing={ () => ref_pw.current.focus() } />
              </View>
              
              {/* Password input */}
              <View style={styles.inputContainer}>
                <Icon name='lock' size={23} color={"#D0CCCB"} /> 
                <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Password (use atleast 8 combined letters and numbers..)"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.password ? user.password : null}
                  returnKeyType={"next"}
                  secureTextEntry={true}
                  textContentType={'password'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, password: val}))
                    haveBlanks()
                  } }
                  onSubmitEditing={ () => ref_cpw.current.focus() }
                  ref={ref_pw} />
              </View>
              
              {/* Confirm Password input */}
              <View style={[styles.inputContainer, {marginBottom: pwMatch ? 0 : 4}]}>
                <Icon name='lock' size={23} color={"#D0CCCB"} /> 
                <TextInput style={styles.input} 
                  placeholder={"Confirm Password"}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  secureTextEntry={true}
                  textContentType={'confirmpw'}
                  onChangeText={(val) => {
                    setConfirmPW(val)
                    // setPWMatch([...user.password === confirmPW])
                    console.log("pwMatch: ", pwMatch)
                    console.log("confirmpw: ", confirmPW)
                  }}
                  onSubmitEditing={ () => ref_email.current.focus() }
                  ref={ref_cpw} />
              </View>
                <View style={{marginBottom: 0, width: '100%', paddingHorizontal: '10%' }}>
                  <TText style={{fontSize: 14, color: ThemeDefaults.appIcon, opacity: pwMatch ? 0 : 1}}>Password does not match</TText>
                </View>


              {/* Email input */}
              <View style={[styles.inputContainer]}>
                <Icon name='at' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Email address"}
                  keyboardType={"email-address"}
                  value={user.email ? user.email : null}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  textContentType={'email'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, email: val}))
                    haveBlanks()
                    } }
                  onSubmitEditing={ () => ref_fn.current.focus() } 
                  ref={ref_email}
                  />
              </View>
              
              {/* First Name input */}
              <View style={styles.inputContainer}>
                <Icon name='account-box' size={23} color={"#D0CCCB"} /> 
                <TextInput style={styles.input} 
                  placeholder={"First Name"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.firstname ? user.firstname : null}
                  returnKeyType={"next"}
                  textContentType={'firstname'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, firstname: val}))
                    haveBlanks()
                  } }
                  onSubmitEditing={ () => ref_mn.current.focus() }
                  ref={ref_fn} />
              </View>

              {/* Middle Name input */}
              <View style={styles.inputContainer}>
                <Icon name='account-box' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  placeholder={"Middle Name (Optional)"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.middlename ? user.middlename : null}
                  returnKeyType={"next"}
                  textContentType={'middlename'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, middlename: val}))
                    haveBlanks()
                  }}
                  onSubmitEditing={ () => ref_ln.current.focus() }
                  ref={ref_mn} />
              </View>
              
              {/* Last Name input */}
              <View style={styles.inputContainer}>
                <Icon name='account-box' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  placeholder={"Last Name"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.lastname ? user.lastname : null}
                  returnKeyType={"next"}
                  textContentType={'lastname'}
                  onChangeText={ (val) => {
                      setUser((prev) => ({...prev, lastname: val}))
                      haveBlanks()
                  }}
                  ref={ref_ln} />
              </View>
              
              {/* Birthday datepicker */}
              <View style={styles.inputContainerBottom}>
                <View style={styles.bdView}>
                  <Icon name='cake' size={20} color={"#D0CCCB"} />
                  <TouchableOpacity onPress={ () => setDatePickerVisibility(true) } style={styles.bdayBtn} >
                    {
                      dateSelected ?
                        <TText style={styles.bdayText}>{displayDate.toString()}</TText>
                        : <View>
                            <TText style={styles.bdayTextPH}>Birthday</TText>
                        </View>
                    }
                    <Icon name="arrow-down-drop-circle" size={18} color={"gray"} />
                  </TouchableOpacity>
                  <DateTimePickerModal
                      isVisible={datePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={() => setDatePickerVisibility(false)}
                    />
                </View>
                <View style={styles.ageView}>
                  <Icon name='counter' size={15} color={"#D0CCCB"} />
                  <TextInput style={styles.input} 
                    placeholder={"Age"}
                    placeholderTextColor={"#A1A1A1"}
                    value={user.age ? user.age : null}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'age'}
                    onChangeText={ (val) => {
                      setUser((prev) => ({...prev, age: val}))
                      haveBlanks()
                    } }
                    ref={ref_age} />
                </View>
                <View style={styles.sexView}>
                  <Icon name='gender-male-female' size={15} color={"#D0CCCB"} /> 
                    <TouchableOpacity 
                      onPress={() => changeModalVisibility(true)}
                      style={{
                        width: '85%', 
                        flexDirection: 'row', 
                        alignItems: 'center',  
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        paddingBottom: 10,
                      }}>
                      <TouchableOpacity 
                        styles={styles.dropdownBtn}
                      >
                      {
                        chooseData ?
                        <TText style={styles.ddText} >{chooseData}</TText>
                        : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Sex</TText>
                      }
                      </TouchableOpacity>
                      <Modal
                        transparent={true}
                        animationType='fade'
                        visible={isModalVisible}
                        onRequestClose={() => changeModalVisibility(false)}
                      >
                        <ModalPicker 
                          changeModalVisibility={changeModalVisibility}
                          setData={setData}
                          sex={true}
                        />
                      </Modal>
                      <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} style={{paddingRight: 6}} />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Next page button */}
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={()=> { 
                  setNext((current) => current + 1)
                  haveBlanks()
                  }}
                >
                <TText style={styles.nextText}>Next</TText>
                <Icon name="arrow-right-thin" size={30} color='white' />
              </TouchableOpacity>
            </View>
          </View> : null
          }
        </ScrollView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#blue',
        height: HEIGHT,
    },
    header: {
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 60,
    },
    headerTitle: {
      fontFamily: 'LexendDeca_Bold',
      fontSize: 28,
      marginBottom: 24
    },
    headerDesc: {
      fontSize: 18,
      width: '80%',
      textAlign: 'center',
      lineHeight: 28
    },
    inputGrp: {
      alignItems: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 7,
      width: '80%',
      marginBottom: 20
    },
    inputContainerBottom: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      // padding: 7,
      width: '80%',
      // marginBottom: 18
    },
    bdView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 10,
      width: '45%',
    },
    bdayBtn: {
      width: '90%', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingLeft: 15,
      paddingRight: 10,
      marginTop: 5
    },
    bdayText: {
      fontSize: 15
    },
    bdayTextPH: {
      fontSize: 18,
      color: '#a1a1a1'
    },
    ageView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 8,
      // marginTop: 1,
      // marginLeft: '1%',
      width: '24%'
    },
    sexView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      width: '28%',
    },
    ddText: {
      marginLeft: 15,
      marginRight: 10,
      fontSize: 18,
    },
    input: {
      width: '90%',
      fontSize: 18,
      marginLeft: 15,
      fontFamily: 'LexendDeca'
    },
    btnContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      width: 160,
      marginTop: 60,
      marginBottom: 40,
    },
    nextBtn: {
      backgroundColor: ThemeDefaults.themeOrange,
      elevation: 4,
      width: '100%',
      height: '100%',
      padding: 10,
      flexDirection: 'row',
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextText: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 18,
      color: ThemeDefaults.themeWhite,
      marginRight: 8
    },
    dropdownBtn: {
      backgroundColor: 'pink',
      width: '100%',
    },
    inputInRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '80%'
    },
    confirm: {
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 130,
    },
    confirmBtn: {
      width: '80%',
      backgroundColor: ThemeDefaults.themeOrange,
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 15,
      elevation: 3,
    },
    confirmModal: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(235, 235, 235, 0.7)',
      position: 'absolute',
      height: HEIGHT,
      width: WIDTH,
      zIndex: 5,
    },
    confirmBox: {
      width: '70%',
      borderRadius: 15,
      overflow: 'hidden',
      borderWidth: 1,
      backgroundColor: ThemeDefaults.themeOrange,
      borderColor: ThemeDefaults.themeOrange,
      elevation: 2 
    },
    confirmModalText: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 20,
      color: ThemeDefaults.themeWhite,
      textAlign: 'center',
      paddingHorizontal: 25,
      // paddingVertical: 15,
      marginVertical: 15
    },
    confirmModalBtnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: ThemeDefaults.themeWhite
    },
    confirmModalBtn: {
      alignItems: 'center',
      paddingVertical: 20,
      width: '100%',
    },
    confirmModalCancel: {

    },
    confirmModalBtnText: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 20
    },
    confirmModalConfirm: {

    },
    workDescriptionContainer: {
      alignItems: 'center'
    },
    workDescriptionBox: {
      width: '80%'
    },
})
