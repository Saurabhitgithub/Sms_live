
import { adminDashboardReport, adminTotalPaidPerMont, adminTotalPaymentData, admindashboaredActiveUser,adminlastMonthRevenueData,admintoTalSubcriberData,admintotalRevenueData, getleadsPerIspForAdmin } from "../../service/admin";


export async function activeUserfunction(){
    let res=await admindashboaredActiveUser()
    
    let resdata= res.data.data;
    console.log(resdata,"check resData")
    
    return {
        active_user: {

            labels: ["Active Users", "Inactive Users"],   


            
            dataUnit: "BTC",
            legend: false,
            datasets: [
              {
                borderColor: "#fff",
                backgroundColor: ["#0E1073",],
                data: [resdata?.total_active, resdata?.total_inactive],
              },
            ],
          },
          userDistribution:{

            labels:  resdata?.distribution?.map(e=>e.role),
            dataUnit: "BTC",
            legend: false,
            datasets: [
              {
                borderColor: "#fff",
                backgroundColor:  ["#A0D468", "#00B074", "#0046B0","#0E1073","#B00000","#00A5B0","#B07400","#0EB000","#8DB000","#A200B0"],
                data: resdata?.distribution?.map(e=>e.count),
              },
            ],
          }
        
    }
}

export async function lastRevenueofMonth(){
    let res= await adminlastMonthRevenueData()
    let resdata=res.data.data
    return{
        labels: resdata?.map(e=>e.isp_name),
          dataUnit: "People",
          datasets: [
            {
              label: "Revenue",
              backgroundColor: ["#A0D468", "#00B074", "#0046B0","#0E1073","#B00000","#00A5B0","#B07400","#0EB000","#8DB000","#A200B0"],
              barPercentage: 0.8,
              categoryPercentage: 0.8,
              data: resdata?.map(e=>e.count),
            },
           
          ],
    }

}

export async function dataofSubcription(){
    let res= await admintoTalSubcriberData()
    let resdata=res.data.data
    return{
        labels: resdata?.map(e=>e.isp_name),
          dataUnit: "People",
          datasets: [
            {
              label: "Total",
              backgroundColor: ["#A0D468", "#00B074", "#0046B0","#0E1073","#B00000","#00A5B0","#B07400","#0EB000","#8DB000","#A200B0"],
              barPercentage: 0.8,
              categoryPercentage: 0.8,
              data: resdata?.map(e=>e.count),
            },
           
          ],
    }
}

export async function dataofleadsIspAdmin(){
  let res= await getleadsPerIspForAdmin()
  let resdata=res.data.data
  return{
      labels: resdata?.map(e=>e.isp_name),
        dataUnit: "People",
        datasets: [
          {
            label: "Total",
            backgroundColor: ["#A0D468", "#00B074", "#0046B0","#0E1073","#B00000","#00A5B0","#B07400","#0EB000","#8DB000","#A200B0"],
            barPercentage: 0.8,
            categoryPercentage: 0.8,
            data: resdata?.map(e=>e.count),
          },
         
        ],
  }
}

export async function dataofInvoices(){
  let res= await adminDashboardReport()
  let resdata=res.data.data
  return{
      labels:["Invoice","Creadit Note","Perfoma Invoice(Unpaid)","Perfoma Invoice(Paid)"],
        dataUnit: "People",
        datasets: [
          {
            label: "Total",
            backgroundColor: ["#A0D468", "#00B074", "#0046B0","#0E1073","#B00000","#00A5B0","#B07400","#0EB000","#8DB000","#A200B0"],
            barPercentage: 0.8,
            categoryPercentage: 0.8,
            data: [resdata?.invoice?.paid,resdata?.invoice?.credit,resdata?.perfomaInvoice?.pending,resdata?.perfomaInvoice?.paid],
          },
         
        ],
  }
}

export async function totalDataRevenue(year){
    let res= await admintotalRevenueData({year})
    let resdata=res.data.data
    // 
    return{
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dataUnit: "Rs",
        datasets: [
          {
            label: "Total Revenue",
            lineTension: 0.4,
            borderColor: "#798bff",
            backgroundColor: "rgba(121, 139, 255, 0.4)",
            pointBorderWidth: 2,
            pointBackgroundColor: "white",
            pointHoverRadius: 3,
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 3,
            fill: true,
            data:resdata?.map(e=>e.revenue) ,
          },
        ],
    }
}

export const totalActiveChartData = {

    labels: ["", ""],
    dataUnit: "BTC",
    legend: false,
    datasets: [
      {
        borderColor: "#fff",
        backgroundColor: ["#0E1073"],
        data: [],
      },
    ],
  };





  export const userDistributionData = {
    labels: ["", "", ""],
    datasets: [
      {
        borderColor: "#fff",
        backgroundColor: ["#0E1073"],
        data: [],
      },
    ],
  }





  export const LastMonthRevenueData = {
    labels: [
      
      
    ],
    dataUnit: "People",
    datasets: [
      {
        label: "join",
        backgroundColor: [
            "#9cabff", // Color for 01
            "#ff9c9c", // Color for 02
            "#ffb39c", // Color for 03
            "#ffde9c", // Color for 04
            "#9cffb0", // Color for 05
          ],
        barPercentage: 0.8,
        categoryPercentage: 0.8,
        data: [
          
        ],
      },
     
    ],
  };


  export const TotalSubcriberPerPlanData = {
    labels: [
    
      
    ],
    dataUnit: "People",
    datasets: [
      {
        label: "join",
        backgroundColor: [
            "#9cabff", // Color for 01
            "#ff9c9c", // Color for 02
            "#ffb39c", // Color for 03
            "#ffde9c", // Color for 04
            "#9cffb0", // Color for 05
          ],
        barPercentage: 0.8,
        categoryPercentage: 0.8,
        data: [
         
        ],
      },
     
    ],
  };

  export const TotalLeadsOfIspPerPlanData = {
    labels: [
    
      
    ],
    dataUnit: "People",
    datasets: [
      {
        label: "join",
        backgroundColor: [
            "#9cabff", // Color for 01
            "#ff9c9c", // Color for 02
            "#ffb39c", // Color for 03
            "#ffde9c", // Color for 04
            "#9cffb0", // Color for 05
          ],
        barPercentage: 0.8,
        categoryPercentage: 0.8,
        data: [
         
        ],
      },
     
    ],
  };

  export const TotalInvoicePlanData = {
    labels: [
    
      
    ],
    dataUnit: "People",
    datasets: [
      {
        label: "join",
        backgroundColor: [
            "#9cabff", // Color for 01
            "#ff9c9c", // Color for 02
            "#ffb39c", // Color for 03
            "#ffde9c", // Color for 04
            "#9cffb0", // Color for 05
          ],
        barPercentage: 0.8,
        categoryPercentage: 0.8,
        data: [
         
        ],
      },
     
    ],
  };


  export const TotalRevenuedata = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dataUnit: "BTC",
    datasets: [
      {
        label: "Total Revenue",
        lineTension: 0.4,
        borderColor: "#798bff",
        backgroundColor: "rgba(121, 139, 255, 0.4)",
        pointBorderWidth: 2,
        pointBackgroundColor: "white",
        pointHoverRadius: 3,
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 3,
        fill: true,
        data: [],
      },
    ],
  };


  export async function totalpaymentData(year){
    let res= await adminTotalPaymentData({year})
    let resdata=res.data.data
    // 
    return{
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dataUnit: "Rs",
        datasets: [
          {
            label: "Total Revenue",
            lineTension: 0.4,
            borderColor: "#798bff",
            backgroundColor: "rgba(121, 139, 255, 0.4)",
            pointBorderWidth: 2,
            pointBackgroundColor: "white",
            pointHoverRadius: 3,
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 3,
            fill: true,
            data:resdata?.map(e=>e.totalAmount) ,
          },
        ],
    }
}


export const TotalPaymentRevenuedata = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dataUnit: "BTC",
  datasets: [
    {
      label: "Total Revenue",
      lineTension: 0.4,
      borderColor: "#798bff",
      backgroundColor: "rgba(121, 139, 255, 0.4)",
      pointBorderWidth: 2,
      pointBackgroundColor: "white",
      pointHoverRadius: 3,
      pointHoverBorderWidth: 2,
      pointRadius: 3,
      pointHitRadius: 3,
      fill: true,
      data: [],
    },
  ],
};


export async function totalpidInvoiceData(year){
  let res= await adminTotalPaidPerMont({year})
  let resdata=res.data.data
  // 
  return{
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dataUnit: "Rs",
      datasets: [
        {
          label: "Total Revenue",
          lineTension: 0.4,
          borderColor: "#798bff",
          backgroundColor: "rgba(121, 139, 255, 0.4)",
          pointBorderWidth: 2,
          pointBackgroundColor: "white",
          pointHoverRadius: 3,
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 3,
          fill: true,
          data:resdata?.map(e=>e.count) ,
        },
      ],
  }
}

export const TotalInvoicePaidAdmindata = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dataUnit: "BTC",
  datasets: [
    {
      label: "Total Revenue",
      lineTension: 0.4,
      borderColor: "#798bff",
      backgroundColor: "rgba(121, 139, 255, 0.4)",
      pointBorderWidth: 2,
      pointBackgroundColor: "white",
      pointHoverRadius: 3,
      pointHoverBorderWidth: 2,
      pointRadius: 3,
      pointHitRadius: 3,
      fill: true,
      data: [],
    },
  ],
};
