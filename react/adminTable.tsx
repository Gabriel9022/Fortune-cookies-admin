import React, { useEffect, useState, useRef } from 'react';
import { Layout, PageBlock, Spinner, Modal, Button, Input, Alert, Box, IconDeny, IconEdit, IconSearch } from 'vtex.styleguide';
import getAllFortuneCookie from './graphql/getAllFortuneCookie.gql';
import deleteFortuneCookie from './graphql/deleteFortuneCookie.gql';
import createFortuneCookie from './graphql/createFortuneCookie.gql';
import modifyFortuneCookie from './graphql/modifyFortuneCookie.gql';
import getSearchFortuneCookie from './graphql/getSearchFortuneCookie.gql';
import { useLazyQuery, useMutation } from 'react-apollo';


interface dataForDelete {
  id: String,
  text: String
}

interface dataForModify {
  id: String,
  text: String
}


const adminTable = () => {

  const [view, setView] = useState<boolean>(true)
  const [change, setChange] = useState<boolean>(true)
  // const [changeSearch, setChangeSearch] = useState<boolean>(false)
  const [alertChange, setAlertChange] = useState<boolean>(false)
  const [alertDeleteChange, setAlertDeleteChange] = useState<boolean>(false)
  const [alertModifyChange, setAlertModifyChange] = useState<boolean>(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false)
  const [dataToDelete, setDataToDelete] = useState<dataForDelete>({
    id: '',
    text: ''
  })
  const [dataToModify, setDataToModify] = useState<dataForModify>({
    id: '',
    text: ''
  })
  const [frase, setFrase] = useState<string>("")
  const [searchFrase, setSearchFrase] = useState<string>('')
  const [allPhrases, setAllPhrases] = useState([])
  const [allSearch, setAllSearch] = useState([])


  const [queryGet, { data, loading }] = useLazyQuery((view ? getAllFortuneCookie : getSearchFortuneCookie), { fetchPolicy: 'network-only', notifyOnNetworkStatusChange: true })


  const [mutationDelete] = useMutation(deleteFortuneCookie)

  const handleDelete: any = (id: string) => {
    mutationDelete({
      variables: { id }
    })
      .then(() => {
        queryGet()
        setChange(!change)
        setAlertDeleteChange(true)
        setIsDeleteModalOpen(false)
      })
  }


  const [mutationModify] = useMutation(modifyFortuneCookie)

  const handleModify: any = (id: string, text: string) => {
    mutationModify({
      variables: { id, text }
    })
      .then(() => {
        queryGet()
        setDataToModify({ id: '', text: '' })
        setChange(!change)
        setAlertModifyChange(true)
        setIsModifyModalOpen(false)
      })
  }

  const [mutationCreate] = useMutation(createFortuneCookie)

  const handleCreate: any = (text: string) => {
    mutationCreate({
      variables: { text }
    })
      .then(() => {
        queryGet()
        setFrase("")
        setChange(!change)
        setAlertChange(true)
        setIsCreateModalOpen(false)
      })
  }


  const handleSearch: any = () => {
    //console.log("text: ", ref.current?.value)
    // queryGet({
    //   variables: {text}
    // })
    // setChangeSearch(true)
    setSearchFrase('')
    setChange(!change)
    setView(false)
  }


  // const handleChangeSearch = (e: any) => {
  //   e.preventDefault()
  //   setSearchFrase(e.target.value)
  // }


  const handleChangeCreate = (e: any) => {
    e.preventDefault()
    setFrase(e.target.value)
  }

  const handleChangeModify = (e: any) => {
    e.preventDefault()
    setDataToModify({
      id: dataToModify.id,
      text: e.target.value
    })
  }

  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (view) {
      queryGet()
    } else {
      queryGet({
        variables: { text: ref && ref.current?.value }
      })
    }
  }, [change, alertChange, view]);

  useEffect(() => {
    if (data) {
      setAllPhrases(data?.getAllFortuneCookie)
    }
  }, [data, change, alertChange, view])

  useEffect(() => {
    if (view == false) {
      setAllSearch(data?.getSearchFortuneCookie)
      // setChangeSearch(false)
    }
  }, [data, change, view])

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleOpenDeleteModal = (data: any) => {
    setIsDeleteModalOpen(true)
    setDataToDelete(data)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleOpenModifyModal = (data: any) => {
    setIsModifyModalOpen(true)
    setDataToModify(data)
  }

  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false)
  }

  const handleCloseAlert = () => {
    setAlertChange(false)
  }

  const handleCloseAlertDelete = () => {
    setAlertDeleteChange(false)
  }

  const handleCloseAlertModify = () => {
    setAlertModifyChange(false)
  }

  const handleShowAll = () => {
    setView(true)
  }


  return (
    <Layout>
      <PageBlock
        title="Fortune Cookies"
        variation="full"
      >
        <h1>Welcome to your fortune cookie administration panel!</h1>
        <div className='flex flex justify-between'>
          <div>
            {/* <input 
            placeholder='New Phrase'
            value={frase}
            name='frase'
            onChange={e => handleChangeCreate(e)}>            
          </input>
          <button onClick={() => handleCreate(frase)}>Create</button> */}
            <Button onClick={() => handleOpenCreateModal()}>Create a New Phrase</Button>
          </div>
          <div>{
            !view ?
              <Button onClick={() => handleShowAll()}>Show all phrases</Button> :
              null
          }
          </div>
          <div>
            <input
              placeholder='Search for a phrase'
              // value={searchFrase}
              // name='searchFrase'
              // onChange={(e: any) => handleChangeSearch(e)}
              ref={ref}
            ></input>
            <Button size='small' onClick={() => handleSearch(searchFrase)}><IconSearch></IconSearch></Button>
          </div>
        </div>
        <Modal
          isOpen={isCreateModalOpen}
          title="Write your new phrase"
          responsiveFullScreen
          onClose={() => handleCloseCreateModal()}
        >
          <div className="flex flex-column flex-row-ns">
            <div className="w-100 mv6">
              <Input
                placeholder='New Phrase'
                size='large'
                value={frase}
                name='frase'
                onChange={(e: any) => handleChangeCreate(e)}>
              </Input>
            </div>
          </div>
          <Button variation="tertiary" onClick={() => handleCloseCreateModal()}>
            Cancel
          </Button>
          <Button variation="primary" onClick={() => { handleCreate(frase) }}>
            Save
          </Button>
        </Modal>
        {alertChange ? <Alert type="success" onClose={() => handleCloseAlert()}>
          Your new Phrase was created with success.
        </Alert> : null}
        {alertDeleteChange ? <Alert type="success" onClose={() => handleCloseAlertDelete()}>
          Phrase was deleted with success.
        </Alert> : null}
        {alertModifyChange ? <Alert type="success" onClose={() => handleCloseAlertModify()}>
          Phrase was modified with success.
        </Alert> : null}
        <div> {view ?
          allPhrases && allPhrases.length ? allPhrases.map((data: any) => {
            return <div key={data.id} className="mv2">
              <Box>
                <div className='flex flex justify-between'>
                  <div className=''>
                    <span>{data.text}</span>
                  </div>
                  <div className=''>
                    <Button variation='secondary' size='small' onClick={() => { handleOpenModifyModal(data) }}><IconEdit color='blue'></IconEdit></Button>
                    <Button variation='danger' size='small' onClick={() => { handleOpenDeleteModal(data) }} ><IconDeny color='white'></IconDeny></Button>
                  </div>
                </div>
              </Box>
            </div>
          }) : loading ? <Spinner /> : null
          :
          allSearch && allSearch.length ? allSearch.map((data: any) => {
            return <div key={data.id} className="mv2">
              <Box>
                <div className='flex flex justify-between'>
                  <div className=''>
                    <span>{data.text}</span>
                  </div>
                  <div className=''>
                    <Button variation='secondary' size='small' onClick={() => { handleOpenModifyModal(data) }}><IconEdit color='blue'></IconEdit></Button>
                    <Button variation='danger' size='small' onClick={() => { handleOpenDeleteModal(data) }} ><IconDeny color='white'></IconDeny></Button>
                  </div>
                </div>
              </Box>
            </div>
          }) : loading ? <Spinner /> :
            <Box>
              <div>
                <h3>No results found for that search, please try another word.</h3>
              </div>
            </Box>
        }
        </div>
        <Modal
          isOpen={isDeleteModalOpen}
          title="You are about to delete a sentence"
          responsiveFullScreen
          onClose={() => handleCloseDeleteModal()}
        >
          <div>
            <span>The phrase that will be deleted is: </span>
            <h4>{dataToDelete.text}</h4>
          </div>
          <Button variation="tertiary" onClick={() => handleCloseDeleteModal()}>
            Cancel
          </Button>
          <Button variation="primary" onClick={() => { handleDelete(dataToDelete.id) }}>
            Delete
          </Button>
        </Modal>
        <Modal
          isOpen={isModifyModalOpen}
          title="You are about to modify a sentence"
          responsiveFullScreen
          onClose={() => handleCloseModifyModal()}
        >
          <div>
            <span>The phrase that will be modified is: </span>
            <h4>{dataToModify.text}</h4>
          </div>
          <div className="w-100 mv6">
            <Input
              placeholder='New Phrase'
              size='large'
              value={dataToModify.text}
              name='modifyText'
              onChange={(e: any) => handleChangeModify(e)}>
            </Input>
          </div>
          <Button variation="tertiary" onClick={() => handleCloseModifyModal()}>
            Cancel
          </Button>
          <Button variation="primary" onClick={() => { handleModify(dataToModify.id, dataToModify.text) }}>
            Save
          </Button>
        </Modal>
      </PageBlock>
    </Layout>
  )
}

export default adminTable