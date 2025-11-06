document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const tableBody = document.querySelector('#productTable tbody');
    const exportButton = document.getElementById('exportButton');
    const clearButton = document.getElementById('clearButton');
    const uniqueItemsSpan = document.getElementById('uniqueItemsCount');
    const totalItemsSpan = document.getElementById('totalItemsCount');
 
    // Inicializar productos desde localStorage o como un array vacío
    let products = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
 
    // Función principal para renderizar la tabla y actualizar contadores
    const renderTable = () => {
        tableBody.innerHTML = ''; // Limpiar la tabla visualmente
 
        let totalCount = 0;
        
        products.forEach((product, index) => {
            // 1. Calcular el total de artículos
            totalCount += parseInt(product.count);
            
            // 2. Crear la fila visual
            const newRow = tableBody.insertRow();
            newRow.dataset.index = index; // Guardar el índice para poder eliminar
 
            // Celda Producto
            const cellName = newRow.insertCell();
            cellName.textContent = product.name;
            
            // Celda Cantidad
            const cellCount = newRow.insertCell();
            cellCount.textContent = product.count;
 
            // Celda Acciones (Botón Eliminar)
            const cellActions = newRow.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌'; 
            deleteButton.classList.add('delete-btn');
            cellActions.appendChild(deleteButton);
        });
 
        // 3. Actualizar los contadores
        uniqueItemsSpan.textContent = products.length;
        totalItemsSpan.textContent = totalCount;
        
        // 4. Guardar los datos en el almacenamiento local
        localStorage.setItem('inventoryProducts', JSON.stringify(products));
    };
 
    // ----------------------------------------------------
    // FUNCIÓN DE AGREGAR / EDITAR
    // ----------------------------------------------------
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
 
        const name = document.getElementById('productName').value.trim();
        const count = parseInt(document.getElementById('productCount').value);
 
        if (name && count > 0) {
            // Buscamos si el producto ya existe para sumarle la cantidad
            const existingProductIndex = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
 
            if (existingProductIndex > -1) {
                // Si existe, actualizamos la cantidad
                products[existingProductIndex].count += count;
            } else {
                // Si es un producto nuevo, lo agregamos
                products.push({ name: name, count: count });
            }
 
            renderTable(); // Volvemos a dibujar la tabla con los datos actualizados
            
            form.reset();
            document.getElementById('productCount').value = 1;
            document.getElementById('productName').focus();
        }
    });
 
    // ----------------------------------------------------
    // FUNCIÓN DE ELIMINAR
    // ----------------------------------------------------
    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.closest('tr'); // Obtiene la fila más cercana
            const index = row.dataset.index;
 
            // Eliminar el producto del array usando el índice
            products.splice(index, 1);
            
            renderTable(); // Volvemos a dibujar la tabla
        }
    });
    
    // ----------------------------------------------------
    // FUNCIÓN DE EXPORTAR A CSV
    // ----------------------------------------------------
    exportButton.addEventListener('click', () => {
        if (products.length === 0) {
            alert("No hay productos para exportar.");
            return;
        }
        
        let csvContent = 'Producto,Cantidad\n'; 
        
        products.forEach(product => {
            // Sanitizar (quitar comas de los nombres para no romper el formato CSV)
            const cleanName = product.name.replace(/,/g, ''); 
            csvContent += `${cleanName},${product.count}\n`;
        });
 
        // Crear y descargar el archivo CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "inventario_pro.csv"); 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Datos exportados a inventario_pro.csv.');
    });
 
    // ----------------------------------------------------
    // FUNCIÓN DE LIMPIAR TODO
    // ----------------------------------------------------
    clearButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar TODOS los productos de la lista?')) {
            products = []; // Vaciar el array
            renderTable(); // Volver a dibujar (mostrará una tabla vacía)
            alert('Inventario limpiado.');
        }
    });
 
    // Inicializar la tabla al cargar la página (carga datos de localStorage si existen)
    renderTable();
});
 