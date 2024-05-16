import React from 'react'
import MainCard from 'ui-component/cards/MainCard'

function CreatePost() {

    const handleSubmit = async (e) =>{
        console.log();
    }
    return (
        <MainCard title="Create New Post">
            <form autoComplete='off' noValidate onSubmit={handleSubmit}>
            
            </form>
        </MainCard>
    )
}

export default CreatePost
