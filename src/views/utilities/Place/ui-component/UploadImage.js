import React, { useState, useEffect } from 'react';
import { Box, ImageList, ImageListItem, ImageListItemBar, IconButton, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UploadImage = ({ onChange, initialImages = [], reset, onResetDone }) => {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (reset) {
            setPreviews([]); // Reset the previews
            setSelectedImage(''); // Reset the previews

            onResetDone();
        }
    }, [reset, onResetDone]);


    // Hàm chuyển đổi URL của hình ảnh thành đối tượng File.
    const urlToFile = async (url) => {
        // Kiểm tra nếu URL không hợp lệ hoặc không được cung cấp thì trả về null.
        if (!url) {
            console.error('Invalid or undefined URL provided');
            return null;
        }
        try {
            // Tiến hành tải blob hình ảnh từ URL.
            const response = await fetch(url);
            const blob = await response.blob();
            // Tạo tên file từ phần cuối cùng của URL và định dạng metadata.
            const filename = url.split('/').pop();
            const metadata = { type: blob.type || 'image/jpeg' };
            // Tạo và trả về đối tượng File.
            return new File([blob], filename, metadata);
        } catch (error) {
            // Nếu có lỗi trong quá trình chuyển đổi, log lỗi và trả về null.
            console.error('Error converting URL to File:', error);
            return null;
        }
    };

    // Sử dụng useEffect để tải hình ảnh ban đầu dựa vào props `initialImages`.
    useEffect(() => {
        const loadInitialImages = async () => {
            // Xóa trạng thái hiển thị trước cũ trước khi tải mới.
            const loadedPreviews = await Promise.all(initialImages.map(async (url) => {
                const file = await urlToFile(url);
                return file ? { url, file } : null;
            }));

            // Loại bỏ các giá trị null và thông báo cho component cha
            const validPreviews = loadedPreviews.filter(preview => preview !== null);
            setPreviews(validPreviews);
            onChange(validPreviews.map(p => p.file)); // Chỉ gọi một lần sau khi tất cả hình ảnh đã được tải
        };

        loadInitialImages();
    }, [initialImages, onChange]); // Dependency array đảm bảo rằng code chỉ chạy khi `initialImages` hoặc `onChange` thay đổi.

    // Xử lý sự kiện khi có file mới được chọn từ input.
    const handleFileChange = (event) => {
        // Tạo URL tạm thời cho file mới và cập nhật trạng thái.
        const filesArray = Array.from(event.target.files).map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        const newPreviews = [...previews, ...filesArray];
        setPreviews(newPreviews);
        onChange(newPreviews.map(p => p.file)); // Thông báo cho component cha về sự thay đổi danh sách các file.
    };

    // Xử lý sự kiện khi người dùng muốn xóa một hình ảnh đã tải lên.
    const handleRemoveImage = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        const remainingFiles = updatedPreviews.map(p => p.file);
        setPreviews(updatedPreviews);
        onChange(remainingFiles); // Thông báo cho component cha về sự thay đổi danh sách các file.
    };

    // Xử lý sự kiện đóng Dialog xem trước hình ảnh.
    const handleClose = () => setOpen(false);

    // Xử lý sự kiện khi người dùng muốn xem trước một hình ảnh, đặt hình ảnh được chọn và mở Dialog.
    const handleOpenImage = (url) => {
        setSelectedImage(url);
        setOpen(true);
    };

    return (
        <Box>
            <input
                accept="image/*"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="raised-button-file"
            />

            <ImageList cols={3} gap={8} sx={{ width: 'auto', height: 135 }}>
                {previews.map((item, index) => (
                    <ImageListItem key={index}>
                        <Button
                            onClick={() => handleOpenImage(item.url)}
                            style={{ padding: 0, width: '100%', height: '100%' }}
                            component="span"
                        >
                            <img
                                src={item.url}
                                alt={`preview ${index}`}
                                loading="lazy"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Button>
                        <ImageListItemBar
                            actionIcon={
                                <IconButton onClick={() => handleRemoveImage(index)}>
                                    <CloseIcon color="error" />

                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                    Upload Images
                </Button>
            </label>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Preview</DialogTitle>
                <DialogContent>
                    <img src={selectedImage} alt="Enlarged preview" style={{ width: '100%' }} />
                </DialogContent>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity="warning" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UploadImage;
