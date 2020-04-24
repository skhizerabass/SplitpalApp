export const calculateAmount =(amount, users)=>{
    const SERVICE_CHARGES = 0.2;
    let groupMonthlyCharges = Number((amount  * SERVICE_CHARGES));
    groupMonthlyCharges = Number(amount) + Number(groupMonthlyCharges);
    let perMemberCharges = groupMonthlyCharges / users;
    return perMemberCharges;

}

export const totalAmount = (amount)=>{
    const SERVICE_CHARGES = 0.2;
    let groupMonthlyCharges = Number((amount  * SERVICE_CHARGES));
    groupMonthlyCharges = Number(amount) + Number(groupMonthlyCharges);
    return groupMonthlyCharges;
}

export const getDateString=(date)=>{
    let d = new Date(date);
    return d.getFullYear()+'/'+(d.getMonth()+1)+'/'+(d.getDate());
}


export  function getDateInUTCWithoutHours(date){
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0,0, 0));
}