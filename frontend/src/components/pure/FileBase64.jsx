import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileBase64 = ({ inputId='image-input', multiple=false, onDone }) => {
    const [files, setFiles] = useState([]);


    const handleChange = (event) => {
        // Get the files
        setFiles(event.target.files);
        let files = event.target.files;
        files.type = 'image/jpeg';

        // Process each file
        let allFiles = [];
        const filesLength = files.length;
        for (let i = 0; i < filesLength; i++) {
            let file = files[i];

            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // On loader load something...
            reader.onloadend = () => {
                // Make a info object
                let fileInfo = {
                    name: file.name,
                    type: file.type,
                    size: Math.round(file.size / 1000) + ' kB',
                    base64: reader.result,
                    file
                };
                
                // Push it to the state
                allFiles.push(fileInfo);

                // If all the files have been proceed
                if (allFiles.length === filesLength) {
                    // Apply callback function
                    if (multiple) onDone(allFiles);
                    else onDone(allFiles[0]);
                }
            }
        }
    }


    return (
        <label htmlFor={inputId} className='custom-file-upload'>
            <div className='file-icon'>
                <FontAwesomeIcon icon='upload' fixedWidth />
            </div>

            <div className='file-text'>
                <span>Click to upload an Image</span>
            </div>

            <input
                type='file'
                id={inputId}
                onChange={handleChange}
                multiple={multiple}
            />

            {
                files && (
                    <span className='file-name'>{files[0]?.name}</span>
                )
            }
        </label>
    );
};


export default FileBase64;