const successPopup = document.getElementById("success-popup");
const profileBalance = document.querySelector(".main-balance");
const donate = document.getElementById("donatinItemsList");
const donationBtn = document.getElementById("donation-btn");
const historyBtn = document.getElementById("history-btn");
const popupBox = document.getElementById("popup-box");
const toast = document.getElementById("toast-simple");
const toastMessageBox = toast.querySelector("div");
let mainBalance = 50000;
const closeConfirmation = document.getElementById("close-confirmation");
const donationListData = [
  {
    totalBalance: 0,
    url: "/images/img2.jpg",
    address: "Donate for Flood at Noakhali, Bangladesh",
    description: `The recent floods in Noakhali have caused significant damage to homes and infrastructure. 
        Your donation will help provide essential supplies to those affected by this disaster. Every contribution, 
        big or small, makes a difference.`,
  },
  {
    totalBalance: 0,
    url: "/images/img1.jpg",
    address: "Donate for Flood Relief in Feni, Bangladesh",
    description: `The recent floods in Feni have devastated local communities, leading to severe disruption and loss. 
        Your generous donation will help provide immediate aid.`,
  },
  {
    totalBalance: 0,
    url: "/images/img3.jpg",
    address: "Aid for Injured in the Quota Movement",
    description: `The recent Quota movement has resulted in numerous injuries. 
        Your support is crucial in providing medical assistance and rehabilitation to those affected.`,
  },
];

const historyListData = [];

function renderDonationList() {
  donate.innerHTML = donationListData.map(donationList).join("");
  attachInputListeners();
}

function renderHistory() {
  if (historyListData.length === 0) {
    donate.innerHTML = `<div class="w-full flex justify-center text-xl">
    <p>History is empty</p>
    </div>`;
    return;
  }
  donate.innerHTML = historyListData.map(historyList).reverse().join("");
}

// Event listeners for donation and history buttons
donationBtn.addEventListener("click", function () {
  donationBtn.classList.remove("text-[#111111]", "border", "border-[#111111]");
  donationBtn.classList.add("bg-[#B4F461]");

  historyBtn.classList.remove("bg-[#B4F461]");
  historyBtn.classList.add("text-[#111111]", "border", "border-[#111111]");

  renderDonationList();
});

// History button
historyBtn.addEventListener("click", () => {
  donationBtn.classList.add("text-[#111111]", "border", "border-[#111111]");
  donationBtn.classList.remove("bg-[#B4F461]");

  historyBtn.classList.add("bg-[#B4F461]");
  historyBtn.classList.remove("text-[#111111]", "border", "border-[#111111]");

  renderHistory();
});

function donationList(file, index) {
  return `
        <div class="w-full h-auto grid grid-cols-2 gap-8 border border-[#111] border-opacity-10 rounded-xl p-5 min-h-full">
    <!-- First column with image -->
    <div class="flex items-stretch">
        <img src="${file.url}" class="h-auto w-full object-cover object-center rounded-xl" alt="" />
    </div>

    <!-- Second column with content -->
    <div class="flex flex-col gap-6 h-auto justify-between">
        <div class="flex">
            <div class="bg-[#111111] bg-opacity-5 gap-2 h-[44px] px-4 rounded-lg text-lg font-medium items-center justify-center flex">
                <img src="/icon/dollar 1.svg" class="w-6 h-6" alt="" />
                <div class="opacity-70">
                    <span>${file.totalBalance}</span>
                    <span>BDT</span>
                </div>
            </div>
        </div>
        <div>
            <h2 class="font-bold text-xl">${file.address}</h2>
        </div>
        <div>
            <p class="text-base font-light text-[#111] text-opacity-70">${file.description}</p>
        </div>
        <div class="w-full">
            <input
                type="number"
                class="w-full h-14 border-2 rounded-lg py-2 px-3 text-base font-light text-[#111] placeholder:text-opacity-40 donation-input"
                placeholder="Write Donation Amount"
            />
        </div>
        <div class="w-full">
            <button class="px-6 py-4 w-full font-semibold text-[#111111] bg-[#B4F461] text-xl rounded-lg donate-button" data-index="${index}">
                Donate Now
            </button>
        </div>
    </div>
</div>
`;
}

function historyList(file) {
  return `
        <div class="p-8 border border-opacity-10 border-[#111] rounded-lg">
            <div class="flex flex-col gap-3">
                <h2 class="text-xl font-bold">
                    <span>৳ ${file.balance}</span> <span>${file.address}</span>
                </h2>
                <p class="text-base text-[#111] text-opacity-70 font-light">
                    Date: <span>${file.currentDate.toLocaleString()}</span>
                </p>
            </div>
        </div>
    `;
}

function attachInputListeners() {
  const inputs = document.querySelectorAll(".donation-input");
  const buttons = document.querySelectorAll(".donate-button");

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const amount = parseFloat(inputs[index].value); // Convert to a number
      if (isNaN(amount) || amount <= 0) {
        toastMessageBox.textContent = "Please enter a valid donation amount.";
        showToast();
        return;
      }

      if (mainBalance === 0) {
        toastMessageBox.textContent = "Your Profile Balance is 0";
        showToast();
        return;
      }

      if (amount > mainBalance) {
        toastMessageBox.textContent = `Your Balance is ${amount} > ${mainBalance}`;
        showToast();
        return;
      }

      mainBalance -= amount;
      donationListData[index].totalBalance += amount;

      historyListData.push({
        balance: amount,
        currentDate: new Date(),
        address: donationListData[index].address,
      });

      closeConfirmation.onclick = () => {
        undoDonation(index, amount);
      };
      showSuccessPopup();
      renderDonationList();
      profileBalance.textContent = mainBalance;
    });
  });
}

function showToast() {
  if (toast) {
    toast.classList.add("translate-y-0", "opacity-100", "scale-100");
    setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100", "scale-100");
    }, 1500);
  }
}

function showSuccessPopup() {
  if (successPopup.classList.contains("hidden")) {
    successPopup.classList.add("flex");
    popupBox.classList.add("show");
    successPopup.classList.remove("hidden");
  }
}

function undoDonation(index, amount) {
  historyListData.shift();
  donationListData[index].totalBalance -= amount;

  successPopup.classList.remove("flex");
  popupBox.classList.remove("show");
  successPopup.classList.add("hidden");
  profileBalance.textContent = mainBalance + amount;
  renderDonationList();
}

successPopup.addEventListener("click", (e) => {
  if (e.target === successPopup) {
    successPopup.classList.remove("flex");
    popupBox.classList.remove("show");
    successPopup.classList.add("hidden");
  }
});

renderDonationList();
profileBalance.textContent = mainBalance;
