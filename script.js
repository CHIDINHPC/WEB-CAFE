let menu = [
    { ten: 'Cà phê đen', gia: 20000 },
    { ten: 'Cà phê sữa', gia: 25000 },
    { ten: 'Trà đào', gia: 30000 },
    { ten: 'Trà sữa', gia: 35000 },
    { ten: 'Nước suối', gia: 10000 }
  ];
  
  const menuDiv = document.getElementById('menu');
  const dsHoaDon = document.getElementById('dsHoaDon');
  const tongTienSpan = document.getElementById('tongTien');
  const banSelect = document.getElementById('banSelect');
  const tkDoanhThu = document.getElementById('tkDoanhThu');
  const lichSuHoaDon = document.getElementById('lichSuHoaDon');
  
  const formSuaMon = document.getElementById('formSuaMon');
  const tenMonSuaInput = document.getElementById('tenMonSua');
  const giaMonSuaInput = document.getElementById('giaMonSua');
  
  let tongTien = 0;
  let hoaDon = [];
  let chiSoSua = -1;
  
  function hienThiMenu() {
    menuDiv.innerHTML = '';
    menu.forEach((mon, index) => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.innerHTML = `
        <span>${mon.ten} - ${mon.gia.toLocaleString()} VND</span>
        <button onclick="batDauSuaMon(${index})">Sửa</button>
        <button onclick="xoaMon(${index})">Xóa</button>
        <button onclick="chonMon(${index})">Chọn</button>
      `;
      menuDiv.appendChild(div);
    });
  }
  
  function chonMon(index) {
    const mon = menu[index];
    hoaDon.push({ ten: mon.ten, gia: mon.gia, soLuong: 1 });
    capNhatHoaDon();
  }
  
  function capNhatHoaDon() {
    dsHoaDon.innerHTML = '';
    tongTien = 0;
    hoaDon.forEach((item, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.ten} - ${item.gia.toLocaleString()} VND x ${item.soLuong} 
        <button onclick="tangSoLuong(${i})">+</button> 
        <button onclick="giamSoLuong(${i})">-</button>
        <button onclick="xoaMonHoaDon(${i})" style="background:#c0392b;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;">Xóa</button>
      `;
      dsHoaDon.appendChild(li);
      tongTien += item.gia * item.soLuong;
    });
    tongTienSpan.textContent = tongTien.toLocaleString();
  }
  
  function tangSoLuong(i) {
    hoaDon[i].soLuong++;
    capNhatHoaDon();
  }
  
  function giamSoLuong(i) {
    if (hoaDon[i].soLuong > 1) {
      hoaDon[i].soLuong--;
    } else {
      hoaDon.splice(i, 1);
    }
    capNhatHoaDon();
  }
  
  function xoaMonHoaDon(i) {
    hoaDon.splice(i, 1);
    capNhatHoaDon();
  }
  
  function xoaDon() {
    dsHoaDon.innerHTML = '';
    tongTien = 0;
    tongTienSpan.textContent = '0';
    hoaDon = [];
  }
  
  function themMon() {
    const ten = document.getElementById('tenMonMoi').value.trim();
    const gia = parseInt(document.getElementById('giaMonMoi').value);
    if (ten && !isNaN(gia)) {
      menu.push({ ten, gia });
      hienThiMenu();
      document.getElementById('tenMonMoi').value = '';
      document.getElementById('giaMonMoi').value = '';
    } else {
      alert('Vui lòng nhập tên và giá hợp lệ');
    }
  }
  
  function batDauSuaMon(index) {
    chiSoSua = index;
    tenMonSuaInput.value = menu[index].ten;
    giaMonSuaInput.value = menu[index].gia;
    formSuaMon.style.display = 'block';
    window.scrollTo(0, document.body.scrollHeight);
  }
  
  function huySuaMon() {
    chiSoSua = -1;
    formSuaMon.style.display = 'none';
    tenMonSuaInput.value = '';
    giaMonSuaInput.value = '';
  }
  
  function capNhatMon() {
    const tenMoi = tenMonSuaInput.value.trim();
    const giaMoi = parseInt(giaMonSuaInput.value);
    if (tenMoi && !isNaN(giaMoi) && chiSoSua >= 0) {
      menu[chiSoSua].ten = tenMoi;
      menu[chiSoSua].gia = giaMoi;
      hienThiMenu();
      huySuaMon();
    } else {
      alert('Vui lòng nhập tên và giá hợp lệ');
    }
  }
  
  function thanhToan() {
    if (hoaDon.length === 0) {
      alert('Không có món nào trong hóa đơn!');
      return;
    }
    const ban = banSelect.value;
    const now = new Date();
    const key = `${ban}_${now.toLocaleDateString()}`;
    let doanhThu = Number(localStorage.getItem(key)) || 0;
    doanhThu += tongTien;
    localStorage.setItem(key, doanhThu);
  
    const chiTiet = hoaDon.map((h) => `${h.ten} (${h.gia.toLocaleString()} VND x${h.soLuong})`).join(', ');
    const item = document.createElement('li');
    item.textContent = `${now.toLocaleTimeString()} - ${ban}: ${tongTien.toLocaleString()} VND gồm: ${chiTiet}`;
    lichSuHoaDon.appendChild(item);
  
    alert(`Đã thanh toán cho ${ban}! Tổng cộng: ${tongTien.toLocaleString()} VND`);
    xoaDon();
    capNhatThongKe();
  }
  
  function inHoaDon() {
    if (hoaDon.length === 0) return alert('Không có hóa đơn để in!');
    let text = '*** HÓA ĐƠN QUÁN CÀ PHÊ ***\n';
    text += `Bàn: ${banSelect.value}\n`;
    hoaDon.forEach((h) => (text += `- ${h.ten}: ${h.gia.toLocaleString()} VND x${h.soLuong}\n`));
    text += `Tổng cộng: ${tongTien.toLocaleString()} VND\n`;
    alert(text);
  }
  
  function capNhatThongKe() {
    tkDoanhThu.innerHTML = '';
    const now = new Date();
    const key = `${banSelect.value}_${now.toLocaleDateString()}`;
    const doanhThuHomNay = Number(localStorage.getItem(key)) || 0;
    const li = document.createElement('li');
    li.textContent = `Doanh thu ${banSelect.value} hôm nay: ${doanhThuHomNay.toLocaleString()} VND`;
    tkDoanhThu.appendChild(li);
  }
  
  function xoaMon(index) {
    if (confirm(`Bạn có chắc muốn xóa món "${menu[index].ten}" khỏi menu không?`)) {
      menu.splice(index, 1);
      hienThiMenu();
    }
  }
  
  window.onload = () => {
    hienThiMenu();
    capNhatThongKe();
  };
  