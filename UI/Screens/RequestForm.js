import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, TextInput, StatusBar, Image, Modal, ScrollView, Dimensions  } from 'react-native'
import React, {useState, useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


import DateTimePickerModal from "react-native-modal-datetime-picker";

import { IPAddress } from '../global/global';
import { ModalPicker } from '../Components/ModalPicker';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import Schedule from './Schedule';

const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const HEIGTH = Dimensions.get('window').height
dayjs.extend(utc)
dayjs.extend(timezone)

const RequestForm = ({route, navigation}) => {

    const screenFocused = useIsFocused()

    const {workerID, workID, workerInformation, selectedJob, minPrice, maxPrice, showMultiWorks} = route.params;
    console.log(workerInformation)

    const [loadedWorkerInfo, setLoadedWorkerInfo] = useState({})
    const [hasLoadedWorkerInfo, setHasLoadedWorkerInfo] = useState(showMultiWorks)
    const [workListModalOpened, setWorkListModalOpened] = useState(false)

    const [workSelected, setWorkSelected] = useState("")
    
    const [timePickerVisible, setTimePickerVisibility] = useState(false)
    const [datePickerVisible, setDatePickerVisibility] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date)
    const [displayDate, setDisplayDate] = useState(new Date())

    const [dateSelected, setDateSelected] = useState(false)
    const [formatedTime, setFormatedTime] = useState(new Date())

    const [displayTime, setDisplayTime] = useState(new Date())
    const [timeSelected, setTimeSelected] = useState(false)

    const [serviceSelected, setServiceSelected] = useState(false)

    const [requestDescription, setRequestDescription] = useState("")

    const [postBtnModal, setPostBtnModal] = useState(false)
    const [confirmServiceRequest, setConfirmServiceRequest] = useState(false)
    const [scheduleModalView, setScheduleModalView] = useState(false)

    const [viewCalendarModal, setViewCalendarModal] = useState(false)
    const [viewScheduleModal, setViewScheduleModal] = useState(false)

    const [sameDateBookings, setSameDateBooking] = useState([])

    const [viewScheduleErrorModal, setViewScheduleErrorModal] = useState(false)
    const [requestpostedModal, setRequestPostedModal] = useState(false)

    const [calendarSelectedDate, setCalendarSelectedDate] = useState(
        {
            ...datesWithCustomization
        }
    )

    useEffect(() => {
        setLoadedWorkerInfo({...workerInformation})
        
        setDateSelected(false)
        setTimeSelected(false)
        setServiceSelected(false)
        
        setFormatedDate(new Date())
        setFormatedTime(new Date())
        setDisplayDate(new Date())
        setDisplayTime(new Date())
        
        if(selectedJob ){
            setServiceSelected(true)
        }

        return () => {
            setLoadedWorkerInfo({...workerInformation})
            if(workSelected) setWorkSelected("")
            if(selectedJob){
                setServiceSelected(true)
            }
        }
    }, [screenFocused])
    
    useEffect(() => {
        setLoadedWorkerInfo({...workerInformation})
        setCalendarSelectedDate({...datesWithCustomization})
        // if(workSelected) setWorkSelected({})

        console.log("workerInformation: ", workerInformation)
    }, [showMultiWorks])

    // calendar things
    const dateDisabledStyles = {
        disabled:true,
        disableTouchEvent: true,
        customStyles: {
            container: {
                // backgroundColor: ThemeDefaults.dateDisabled,
                borderRadius: 5,
            },
            text: {
                color: '#c2c2c2'
            }
        }
    }

    const dateAppointmentStyles = {
        customStyles: {
            container: {
                backgroundColor: ThemeDefaults.dateAppointments,
                borderRadius: 5,
            },
            text: {
                color: ThemeDefaults.themeWhite
            }
        }
    }

    const dateTodayStyles = {
        customStyles: {
            container: {
                borderWidth: 1.2,
                borderColor: ThemeDefaults.themeDarkBlue,
                borderRadius: 5,
            },
            text: {
                color: ThemeDefaults.themeDarkBlue,
            }
        }
    }

    // array of dates which have appointments and unavailable dates
    const dateToday = dayjs(new Date()).format("YYYY-MM-DD")
    const datesWithCustomization = {
        '2022-10-27': dateDisabledStyles,
        '2022-10-19': dateDisabledStyles,
        [dateToday.toString()] : dateTodayStyles,
    }

    const CalendarMonthArrow = (props) => {
        return(
            <Icon name={`arrow-${props.direction}`} size={22} color={ThemeDefaults.themeDarkBlue} />
        )
    }

    // calendar things -------

    const handleDateConfirm = (date) => {
        
        let da = new Date(date).toISOString()
        let nn = dayjs(date).format("YYYY-MM-DD")
        
        setFormatedDate(dayjs(date).format("YYYY-MM-DD"));

        setDisplayDate(dayjs(date).format("MMM D, YYYY"));
        setDatePickerVisibility(false);
        setDateSelected(true)
        setViewCalendarModal(false)
        setViewScheduleModal(true)

        // set as date selected on calendar
        datesWithCustomization[da.toString()] = dateAppointmentStyles

        getSameDateBookings(date)

    }

    const getSameDateBookings = (date) => {
        fetch(`https://hanaplingkod.onrender.com/worker/${workerID}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            },
        }).then((res) => res.json())
        .then((data) => {
            let fd = dayjs(date).utc(true).format()
            
            // // console.log("fd", fd)
            // let list = data.worker.filter(e => {
            //     let aa = dayjs(e.serviceDate).utc(true).format()
            //     // console.log("aa", aa)
            //     return aa === fd
            // })
            // setSameDateBooking([...list])

            // unavailableTime from worker
            console.log(data.unavailableTime)
            let list = []

            let startDate

            list = data.unavailableTime.filter(e => {
                dayjs(e.startTime).format("YYYY-MM-DD") === dayjs(fd).format("YYYY-MM-DD")
            })

            console.log("List of unvailable dates same time: ", list)

            console.log("list same date accepted bookings - calendar", list)
        }).catch((err) => console.log("get same dates error", err.message))
    }

    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("YYYY-MM-DD hh:mm:ss")
        let timetime = dayjs(time).format("hh:mm")
        setDisplayTime(dayjs(time).format("hh:mm A"))
        
        setFormatedTime(timetime)
        setTimePickerVisibility(false)
        setTimeSelected(true)

        let newDate = new Date(formatedDate.getFullYear(), formatedDate.getMonth(), formatedDate.getDate(),
                                formatedTime.getHours(), formatedTime.getMinutes(), formatedTime.getSeconds())

        console.log(formatedTime)
        console.log("new date: ", newDate)

    }

    const changeWorkListModalVisibility = (bool) => {
        setWorkListModalOpened(bool)
    }

    const postRequest = () => {
        console.log(workerID)
        console.log("user: ", global.userData._id)
        console.log(selectedJob)
        // console.log(workSelected.ServiceSubId.ServiceSubCategory)
        console.log(minPrice)
        console.log(maxPrice)
        console.log(formatedDate)
        console.log(formatedTime)

        let user = global.userData

        fetch(`http://${IPAddress}:3000/service-request`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                "workerId": workerID,
                "recruiterId": global.userData._id,
                'workId': workID,
                "address": `${user.street}, ${user.purok}, ${user.barangay} ${user.city}, ${user.province}`,
                "subCategory": selectedJob ? selectedJob : workSelected.ServiceSubId.ServiceSubCategory,
                "minPrice": minPrice ? minPrice : workSelected.minPrice,
                "maxPrice": maxPrice ? maxPrice : workSelected.maxPrice,
                "serviceDate": formatedDate,
                "startTime": formatedTime,
                "description": requestDescription,
                "lat": 85,
                "long": 20,
            })
        }).then((res) => {
            console.log("Service Request Posted! ")
            // global.serviceRequestPosted = true
            setRequestDescription("")
            setFormatedDate(new Date())
            setFormatedTime(new Date())
            // navigation.navigate("HomeScreen")
        })
        .catch((err) => console.log("Service Request Error: ", err))
    }

  return (
        <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: ThemeDefaults.themeWhite, paddingTop: StatusBar.currentHeight, paddingBottom: 50}}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

            {/* Modals */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={postBtnModal}
                onRequestClose={() => setPostBtnModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText, {marginBottom: 20}]}>Are you sure you want to send a service request?</TText>
                            <TText style={[styles.dialogueMessageText, {fontSize: 14,}]}>(Reminder: You can only send one service request at a time)</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setConfirmServiceRequest(true)
                                    setRequestPostedModal(true)
                                    // fetch post request
                                    postRequest()
                                    setPostBtnModal(false)
                                    // navigation.navigate("HomeScreen")
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setPostBtnModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Schedule error modal */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewScheduleErrorModal}
                onRequestClose={() => setViewScheduleErrorModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText]}>The time you picked conflicts with the worker’s schedule. You may check their schedule and choose  another time slot.</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    // fetch post request
                                    // navigation.navigate("HomeScreen")

                                    setViewScheduleErrorModal(false)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Okay</TText>
                            </TouchableOpacity>
                            {/* <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setPostBtnModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Service Request success || Request has been made */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={requestpostedModal}
                onRequestClose={() => {
                //   global.serviceRequestPosted = false
                setRequestPostedModal(false)
                }}
            >

                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText]}>Your request has been made.</TText>
                            <TText style={[styles.dialogueMessageText, {marginTop: 20}]}>Kindly wait for the worker to respond.</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                setRequestPostedModal(false)
                                navigation.navigate("HomeScreen")
                                //   global.serviceRequestPosted = false
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>Got it</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Modal Calendar View */}
            <Modal
                transparent={true}
                animationType='slide'
                visible={viewCalendarModal}
                onRequestClose={() => setViewCalendarModal(false)}
            >

                <View style={styles.modalCalendar}>
                    {/* screen header */}
                    <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} changeCalendarModalState={setViewCalendarModal} modalCalendar={true} />
                    
                    <View style={styles.calendaHeaderCont}>
                    {
                        global.userData.role === "recruiter" ?
                            <View style={styles.header}>
                                <TText style={styles.headerTitle}>Date Selection</TText>
                                <TText style={styles.headerSubTitle}>Select and confirm date of appointment</TText>
                            </View>
                            :
                            <View style={styles.header}>
                                <TText style={styles.headerTitle}>Calendar</TText>
                                <TText style={styles.headerSubTitle}>Select dates where you will be unavailable</TText>
                            </View>
                    }
                    </View>

                    <Calendar 
                        minDate={dateToday.toString()}
                        enableSwipeMonths={true}
                        markingType={'custom'}
                        markedDates={
                            calendarSelectedDate        
                        }
                        onDayPress={day => {
                            datesWithCustomization[day.dateString] = dateAppointmentStyles
                            setCalendarSelectedDate({...datesWithCustomization})
                            handleDateConfirm(day.timestamp)

                            // navigation.navigate("ScheduleDrawer", {dateSelected: displayDate})
                        }}
                        theme={{
                            indicatorColor: ThemeDefaults.themeDarkBlue,
                            todayTextColor: 'white',
                        }}
                        renderArrow={direction => <CalendarMonthArrow direction={direction} /> }
                        renderHeader={date => {
                            let timeString = dayjs(date).format("MMMM YYYY")
                            return(
                                <View style={styles.calendarMonthHeader}>
                                    <TText style={styles.calendarMonthHeaderTxt}>{timeString}</TText>
                                </View>
                            )
                        }}
                    />

                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={{backgroundColor: ThemeDefaults.themeOrange, width: 25, height: 25, borderRadius: 8}} />
                            <TText style={styles.legendTxt}>{global.userData.role === "recruiter" ? "Date Selected" : "Available Date with Appointments"}</TText>
                        </View>
                        {/* <View style={styles.legendItem}>
                            <View style={{backgroundColor: ThemeDefaults.themeLighterBlue, width: 25, height: 25, borderRadius: 8}} />
                            <TText style={styles.legendTxt}>Date Unavailable</TText>
                        </View> */}
                    </View>

                    {/* Confirm Select */}
                    
                </View>
                
            </Modal>

            {/* Schedule Modal */}
            <Modal
                transparent={true}
                animationType='slide'
                visible={viewScheduleModal}
                onRequestClose={() => setViewScheduleModal(false)}
            >
                <ScrollView contentContainerStyle={styles.modalCalendar}>
                    {/* screen header */}
                    <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} changeSchedModalState={setViewScheduleModal} changeCalendarModalState={setViewCalendarModal} modalSchedule={true} />

                    <View style={styles.headerContainer}>
                        <TText style={styles.headerTitle}>Worker's Schedule</TText>
                        <TText style={styles.headerSchedSubTitle}>{sameDateBookings.length > 0 ? "Shown below are the worker's appointments scheduled on " : "The worker you selected has no appointments scheduled on "}<TText style={styles.headerSubTitleDate}>{dayjs(formatedDate).format("MMMM D")}</TText></TText>
                    </View>

                    <View style={styles.timeBtnContainer}>
                        {/* Time Picker */}
                        <View>
                            <TText>Select Time</TText>
                        </View>

                        <TouchableOpacity 
                            style={styles.timePickerBtn}
                            onPress={() => setTimePickerVisibility(true)}
                        >
                            <View style={styles.timeTextContainer}>
                                <Icon name="clock-outline" size={20} />
                                <TText style={styles.timePickerText}>{timeSelected ? displayTime.toString() : "Time"}</TText>
                            </View>
                            <Icon name="chevron-right" size={20} />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={timePickerVisible}
                            mode="time"
                            onConfirm={handleTimeConfirm}
                            onCancel={() => setTimePickerVisibility(false)}
                        />

                        {/* show if time is taken */}
                        <View style={{marginTop: 2, paddingLeft: 5}}>
                            <TText style={{fontSize: 14, color: ThemeDefaults.themeOrange}}>Time is already taken by another recruiter</TText>
                        </View>
                    </View>

                    <View style={styles.scheduleList}>
                        {/* <View style={styles.schedCard}>
                            <TText style={styles.schedTitle}>Booked: Carpet Cleaning</TText>
                            <TText style={styles.schedTime}>08:00 AM - 09:00 AM</TText>
                        </View>
                        <View style={[styles.schedCard, {paddingBottom: 20 * 3}]}>
                            <TText style={styles.schedTitle}>Booked: Carpet Cleaning</TText>
                            <TText style={styles.schedTime}>08:00 AM - 09:00 AM</TText>
                        </View> */}
                        {
                            sameDateBookings.map(function(item, index){
                                return(
                                    <View key={index} style={[styles.schedCard, {height: 'auto'}]}>
                                        <TText style={styles.schedTitle}>Booked: {item.subCategory}</TText>
                                        <TText style={styles.schedTime}>{dayjs(item.startTime).format("hh:mm A")} - {dayjs(item.endTime).format("hh:mm A")}</TText>
                                    </View>
                                )
                            })
                        }
                    </View>

                    

                    <View style={styles.confirmBtnContainer}>
                        <TouchableOpacity style={styles.confirmBtn}
                            onPress={() => {
                                setViewCalendarModal(false)
                                setViewScheduleModal(false)

                                //---
                                setViewScheduleErrorModal(true)
                            }}
                        >
                            <TText style={styles.confirmBtnText}>Confirm Time</TText>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
                
            </Modal>

            

            {/* Date Picker */}
            {/* May use a different screen instead to control the selection of dates based from the workers availability */}
            <DateTimePickerModal
                isVisible={datePickerVisible}
                mode="date"
                minimumDate={new Date()}
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
            />

            {/* Time Picker */}
            <DateTimePickerModal
                isVisible={timePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setTimePickerVisibility(false)}
            />

            {/* Header */}
            <View style={styles.headerContainer}>
                <TText style={styles.headerTitle}>Request Form</TText>
                <TText style={styles.headerSubTitle}>Please fill in the request form carefully.</TText>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                {/* Form Title */}
                <TText style={styles.formTitle}>Delivery Address of Service</TText>
                
                {/* Form inputs */}
                <View style={styles.inputsContainer}>
                    {/* Recruiter's Address */}
                    <View style={styles.formAddressBar}>
                        <View style={styles.formAddTxtContainer}>
                            <Icon name='map' size={22} color={ThemeDefaults.themeLighterBlue} />
                            <View style={styles.formAddTxt}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.addressInfo}>{global.userData.street}, Purok {global.userData.purok}, {global.userData.barangay}, {global.userData.city}, {global.userData.province}</Text>
                                <TText style={styles.addressSubTitle}>Default Home Address</TText>
                            </View>
                        </View>
                        <Icon name='map-marker' size={22} />
                    </View>

                    {/* Select Date */}
                    <TouchableOpacity style={styles.formAddressBar}
                        onPress={() => {
                            // setDatePickerVisibility(true)
                            setViewCalendarModal(true)
                            // navigation.navigate("CalendarDrawer")
                        }}
                    >
                        <View style={styles.formAddTxtContainer}>
                            <Icon name='calendar-month' size={22} />
                            <View style={styles.formAddTxt}>
                                <TText style={styles.addressInfo}>{dateSelected ? displayDate : "Date"}</TText>
                            </View>
                        </View>
                        <Icon name='chevron-down' size={22} />
                    </TouchableOpacity>

                    {/* Time Select Schedule | ROW */}
                    <View style={styles.timeRowContainer}>
                        <TouchableOpacity style={styles.timeAddressBar}
                            onPress={() => setTimePickerVisibility(true)}
                        >
                            <View style={styles.timeAddressContainer}>
                                <Icon name='clock-outline' size={22} />
                                <View style={styles.formTimeTxt}>
                                    <TText style={styles.timeTxt}>{ timeSelected ? displayTime : "Time"}</TText>
                                </View>
                            </View>
                            <Icon name='chevron-down' size={22} />
                        </TouchableOpacity>
                        <View style={styles.checkScheduleContainer}>
                            <TouchableOpacity style={[styles.checkScheduleBtn, {backgroundColor: dateSelected ? ThemeDefaults.themeLighterBlue : "#c2c2c2"}]}
                                disabled={!dateSelected}
                                onPress={()=> {
                                    if(dateSelected){
                                        setViewScheduleModal(true)
                                    }
                                }}
                            >
                                <TText style={styles.checkSchedTxt}>Check Schedule</TText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Selected Service */}
                    <TouchableOpacity disabled={!showMultiWorks} style={styles.formAddressBar}
                        onPress={() => setWorkListModalOpened(true)}
                    >
                        <View style={styles.formAddTxtContainer}>
                            <Icon name='briefcase' size={22} />
                            <View style={styles.formAddTxt}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.workSubCategory}>{workSelected ? workSelected.ServiceSubId.ServiceSubCategory : selectedJob ? selectedJob : "Select the service you need.."}</Text>
                                {
                                    showMultiWorks && <TText style={styles.addressSubTitle}>Select one of the worker’s services here</TText>
                                }
                            </View>
                        </View>
                        {
                            showMultiWorks &&
                            <Icon name="chevron-down" size={22} />
                        }

                        {/* Modal Picker for WorkList */}
                        {
                            showMultiWorks &&
                            <Modal
                                transparent={true}
                                animationType='fade'
                                visible={workListModalOpened}
                                onRequestClose={() => setWorkListModalOpened(false)}
                            >
                                <ModalPicker 
                                    changeModalVisibility={changeWorkListModalVisibility}
                                    setData={(wl) => {
                                        setWorkSelected({...wl})
                                        setServiceSelected(true)
                                    }}
                                    workList={true}
                                    workerID={workerID}
                                />
                            </Modal>
                        }

                    </TouchableOpacity>

                </View>

                {/* Addditional request information/description */}
                <View style={styles.requestDescriptionContainer}>
                    <Icon name="text-box" size={22} />
                    <TextInput 
                        multiline
                        numberOfLines={5}
                        style={styles.requestDescriptionTextInput}
                        placeholder='Additional service request description (Optional)'
                        value={requestDescription && requestDescription}
                        keyboardType='default'
                        onChangeText={(val) => setRequestDescription(val)}
                    />
                </View>

                {/* Worker Information */}
                <View style={styles.workerInformationContainer}>
                    <View style={styles.workerInfoRow}>
                        <View style={styles.iconTxtContainer}>
                            <Icon name="tag" size={22} style={styles.iconFlip} />
                            <TText style={styles.feeTitleTxt}>Service Fee Range</TText>
                        </View>
                        <TText style={styles.feeTxt}>₱ {workSelected ? (`${workSelected.minPrice} - ${workSelected.maxPrice}`) : minPrice ? (`${minPrice} - ${maxPrice}`) : '0.00'}</TText>
                    </View>

                    {/* Worker Name */}
                    <View style={styles.workerInfoRow}>
                        <View style={styles.iconTxtContainer}>
                            <Icon name="account-hard-hat" size={22} style={styles.iconFlip} />
                            <TText style={styles.feeTitleTxt}>Worker Requested</TText>
                        </View>
                        <TText style={styles.workerNamefeeTxt}>{loadedWorkerInfo.firstname} {loadedWorkerInfo.lastname}</TText>
                    </View>

                    {/* Worker Profile Bar */}
                    <View style={styles.workerBarContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={ loadedWorkerInfo.profilePic === 'pic' ? require("../assets/images/default-profile.png") : {uri: loadedWorkerInfo.profilePic}} style={styles.imageStyle} />
                        </View>
                        <View style={styles.workerInformation}>
                            <View>
                                <View style={styles.workerNameContainer}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerName}>{loadedWorkerInfo.firstname}{loadedWorkerInfo.middlename !== "undefined" ? loadedWorkerInfo.middlename : ""} {loadedWorkerInfo.lastname}</Text>
                                    {
                                        loadedWorkerInfo.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null
                                    }
                                </View>
                                <View style={styles.nameStarContainer}>
                                    <Icon name='star' size={20} color="gold" />
                                    <TText style={styles.workerStars}>4.7</TText>
                                </View>
                            </View>
                            {/* <View style={styles.viewBtnContainer}> */}
                                <TouchableOpacity style={styles.viewProfileBtn}
                                    onPress={() => {
                                        navigation.navigate("WorkerProfileDrawer", {workerID: workerID})
                                    }}
                                >
                                    <TText style={styles.viewProfileText}>Profile</TText>
                                </TouchableOpacity>
                            {/* </View> */}
                        </View>
                        {/* <View style={styles.viewBtnContainer}>
                            <TouchableOpacity style={styles.viewProfileBtn}
                                onPress={() => {
                                    navigation.navigate("WorkerProfileDrawer", {workerID: workerID})
                                }}
                            >
                                <TText style={styles.viewProfileText}>Profile</TText>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    

                </View>
                
            </View>

            {/* Summary */}
            

            {/* Submit Request Button */}
            <View style={styles.submitBtnContainer}>
                <TouchableOpacity 
                    style={[styles.submitBtn, {backgroundColor: dateSelected && timeSelected && serviceSelected ? ThemeDefaults.themeOrange : '#c2c2c2', elevation: 0}]}
                    disabled={!dateSelected && !timeSelected && serviceSelected}
                    onPress={() => {
                        setPostBtnModal(true)

                    }}
                >
                    <TText style={styles.submitBtnTxt}>Submit Request</TText>
                </TouchableOpacity>


            </View>
        </ScrollView>

  )
}

export default RequestForm

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
    },
    scrollViewContainer: {
        // flex: 1,
        height: HEIGTH,
        paddingBottom: 150,
        paddingTop: StatusBar.currentHeight,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10
    },
    headerTitle: {
        fontSize: 20,
        marginBottom: 10
    },
    headerSubTitle: {
        fontSize: 15
    },
    headerSchedSubTitle: {
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    headerSubTitleDate: {
        fontFamily: 'LexendDeca_Medium'
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 20
    },
    formTitle: {
        fontSize: 15
    },
    inputsContainer: {
        marginTop: 8
    },
    formAddressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        padding: 12,
        marginBottom: 10,

        borderWidth: 1.8,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,

        backgroundColor: ThemeDefaults.themeWhite
    },
    formAddTxtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    formAddTxt: {
        flex: 0.93,
        marginLeft: 12
    },
    addressInfo: {
        fontFamily: 'LexendDeca',
        fontSize: 16,
        fontFamily: 'LexendDeca'
    },
    workSubCategory: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
    },
    addressSubTitle: {
        fontSize: 12,
        color: ThemeDefaults.themeOrange
    },
    timeRowContainer: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 10,
    },
    checkScheduleContainer: {
        flex: 0.9,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        // paddingLeft: 12
    },
    checkScheduleBtn: {
        width: '90%',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 0,

        borderRadius: 10,

        backgroundColor: ThemeDefaults.themeLighterBlue,
    },
    checkSchedTxt: {
        color: ThemeDefaults.themeWhite,
        fontFamily: 'LexendDeca_Medium',
        fontSize: 14
    },
    timeAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 12
    },
    timeAddressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // width: '90%',

        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 14,
        // marginBottom: 10,

        borderWidth: 1.8,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,

        backgroundColor: ThemeDefaults.themeWhite
    },
    timeTxt: {
        // width: '90%',
        fontSize: 18,
        fontFamily: 'LexendDeca',
        color: ThemeDefaults.themeLighterBlue,
    },
    formTimeTxt: {
        // width: '80%',
        paddingLeft: 12,
    },
    workerInformationContainer: {
        marginTop: 20,
    },
    workerInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 10
    },
    iconTxtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    feeTitleTxt: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray',
    },
    feeTxt: {
        fontSize: 18,
        color: ThemeDefaults.appIcon
    },
    workerNamefeeTxt: {
        fontSize: 18,
    },
    iconFlip: {
        transform: [
            {
                scaleX: -1,
            },
        ]
    },
    workerBarContainer: {
        height: 80,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: ThemeDefaults.themeWhite,

        overflow: 'hidden',

        borderRadius: 10,
        elevation: 4
    },
    imageContainer: {
        // flex: 1,
        width: 80,
        height: 80,
    },
    imageStyle: {
        width: 80,
        height: 80,
    },
    nameStarContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    workerInformation: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    workerNameContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    workerName: {
        fontSize: 18,
        fontFamily: 'LexendDeca_Medium'
    },
    workerStars: {
        fontSize: 14,
        alignContent: 'center',
        marginLeft: 5
    },
    viewBtnContainer: {
        flex: 1,
        alignItems: 'center',
        paddingRight: 5
    },
    viewProfileBtn: {
        backgroundColor: ThemeDefaults.themeLighterBlue,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    viewProfileText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 14,
    },
    submitBtnContainer: {
        // position: 'absolute',
        // bottom: 50,
        // left: 40,
        // right: 40,

        paddingHorizontal: 40,
        marginTop: 50,
        marginBottom: 40
    },
    submitBtn: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 20,
        backgroundColor: ThemeDefaults.themeOrange,
        elevation: 4
    },
    submitBtnTxt: {
        color: ThemeDefaults.themeWhite,
        fontSize: 18,
        fontFamily: 'LexendDeca_SemiBold'
    },
    requestDescriptionContainer: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',

        borderWidth: 1.8,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
    },
    requestDescriptionTextInput: {
        width: '90%',
        paddingTop: 2,
        marginLeft: 10,
        fontFamily: 'LexendDeca',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    summaryContainer: {
        paddingHorizontal: 20,
        marginTop: 30
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 8
    },
    summaryTitle: {
        fontSize: 18
    },
    summaryAddressTxt: {
        flex: 0.4,
        marginRight: 10
    },
    summaryAddressVal: {
        flex: 1,
        textAlign: 'right'
    },
    summaryServiceTxt: {

    },
    summaryServiceVal: {

    },
    summaryDate: {

    },
    summaryDateVal: {

    },
    summaryTime: {

    },
    summaryTimeVal: {

    },
    summaryWorkerTxt: {

    },
    summaryWorkerVal: {

    },
    modalDialogue: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    dialogueContainer: {
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeLighterBlue,
        borderRadius: 15,
        overflow: 'hidden',
    },
    dialogueMessage: {
        paddingVertical: 40,
        paddingHorizontal: 50,
        backgroundColor: ThemeDefaults.themeLighterBlue,
    },
    dialogueMessageText: {
        color: ThemeDefaults.themeWhite,
        textAlign: 'center',
        fontFamily: 'LexendDeca_Medium',
    },
    modalDialogueBtnCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: ThemeDefaults.themeWhite,
    },
    dialogueBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    dialogueCancel: {

    },
    dialogueConfirm: {
        color: ThemeDefaults.themeDarkerOrange,
        fontFamily: 'LexendDeca_Medium',
    },
    calendaHeaderCont: {
        alignItems: 'center', 
        marginBottom: 30
    },
    header: {
        alignItems: 'center'
    },
    modalCalendar: {
        flexGrow: 1,
        backgroundColor: ThemeDefaults.themeWhite
    },
    calendarMonthHeader: {
        width: 250,
        alignItems: 'center',
        paddingVertical: 3,
        backgroundColor: '#D9D9D9',
        borderRadius: 30,
    },
    calendarMonthHeaderTxt: {
        fontSize: 18
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        marginTop: 50
    },
    legendTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    legendColor: {
        width: 30,
        height: 30,
        borderRadius: 5,
    },
    legendTxt: {
        marginLeft: 15,
        fontFamily: 'LexendDeca_Medium'
    },
    timeBtnContainer: {
        paddingHorizontal: 50,
        width: '100%',
        marginTop: 30
    },
    timePickerBtn: {
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10,
        padding: 12,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeTextContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    timePickerText: {
        marginLeft: 10
    },
    scheduleList: {
        paddingHorizontal: 50,
        width: '100%',
        marginVertical: 30,
        marginBottom: 150,
    },
    schedCard: {
        width: '100%',
        backgroundColor: ThemeDefaults.themeFadedBlack,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    schedTitle: {
        color: ThemeDefaults.themeWhite
    },
    schedTime: {
        color: ThemeDefaults.themeWhite
    },
    confirmBtnContainer: {
        // flexGrow: 1,
        width: '100%',
        paddingHorizontal: 50,
        position: 'absolute',
        bottom: 60,
        // left: 50,
        // righ: 50,
        // backgroundColor: 'pink'
    },
    confirmBtn: {
        width: '100%',
        flexGrow: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: ThemeDefaults.themeOrange
    },
    confirmBtnText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 18,
        fontFamily: "LexendDeca_SemiBold"
    },
})