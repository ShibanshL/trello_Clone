function Sidebar(listData:any) {

  return (
    <div className='SideBar'>
      <h2>Board Details</h2>
        {listData?.listData?.children?.map((e:any) => {
              return(
                <>
                    <div className="SidebarCards">
                      <h3>{e.name}</h3>
                      {e.children.map((val:any) => {
                        return(
                          <p>
                           - {val.data.name}
                          </p>
                        )
                      })}
                    </div>
                </>
              )
            }
          )
        }
    </div>
  )
}

export default Sidebar